"""SFlyra AI backend — FastAPI + OpenAI Agent SDK with provider fallback.

Provider chain (first key found wins, in this order):
    Grok (xAI) -> OpenRouter -> Gemini -> OpenAI (optional)

If a provider is rate-limited, unreachable or errors, the backend silently
falls through to the next one. The user never sees which provider answered,
and a provider-level timeout guarantees the conversation can never get stuck.

Endpoints:
    GET  /api/health          -> liveness + configured providers
    GET  /api/agents          -> list of available product/service agents
    POST /api/chat            -> stream a chat completion (SSE)

Run:
    cd backend
    pip install -r requirements.txt
    copy .env.example .env   (fill at least one provider key)
    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from agents import Runner

from sflyra_agents import (
    AGENT_NAMES,
    build_agent,
    get_provider_labels,
    get_providers,
    has_config,
)

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(
    title="SFlyra AI Agents API",
    version="2.0.0",
    description="Product-specific OpenAI agents with automatic provider fallback.",
)

ALLOWED_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8080,http://localhost:5173,http://localhost:3000,http://127.0.0.1:8080",
).split(",")

# Allow any *.vercel.app origin so the deployed site can call the hosted backend
# without configuring CORS manually. Tighten via the CORS_ORIGINS env var.
_VERCEL_APP_REGEX = r"https://[a-zA-Z0-9-]+\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_origin_regex=_VERCEL_APP_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seconds a single provider may run before we abandon it and try the next.
# The per-provider client also enforces its own request/read timeout in
# sflyra_agents.py (_TIMEOUT), so both layers bound the conversation.


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class ChatMessage(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str


class ChatRequest(BaseModel):
    agent_id: str = Field(default="ai-chatbot")
    messages: list[ChatMessage] = Field(default_factory=list)


class AgentInfo(BaseModel):
    id: str
    name: str
    description: str


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
_AGENT_DESCRIPTIONS = {
    "ai-chatbot": "Ready-to-deploy chatbot for your website and Instagram DMs.",
    "email-whatsapp-automation": "Triggered email & WhatsApp flows, auto-replies and CRM sync.",
    "social-media-auto-poster": "Auto-generate captions and schedule posts across platforms.",
    "ai-content-writer": "On-brand blog posts, ad copy, captions and descriptions in seconds.",
    "ai-automation": "Custom AI systems that run your operations on autopilot.",
    "agentic-workflows": "Multi-step agents that research, decide and act across your tools.",
    "ai-chatbot-development": "Custom AI chatbots trained on your data, handling customers 24/7.",
    "web-development": "Fast, SEO-ready websites and stores built around your business.",
    "graphic-designing": "Logos and full brand kits that make you instantly recognizable.",
    "digital-marketing": "Social growth and paid campaigns with healthy ROAS.",
    "video-animation": "Explainer videos and motion graphics that bring ideas to life.",
    "video-editing": "Reels, ads and content cuts engineered to hold attention.",
}


@app.get("/api/health")
async def health() -> dict:
    providers = get_providers()
    return {
        "status": "ok",
        "providers_configured": [p.label for p in providers],
        "agents": len(AGENT_NAMES),
        "ready": bool(providers),
    }


@app.get("/api/agents", response_model=list[AgentInfo])
async def list_agents() -> list[AgentInfo]:
    """Return metadata for every product/service agent."""

    return [
        AgentInfo(
            id=agent_id,
            name=AGENT_NAMES[agent_id],
            description=_AGENT_DESCRIPTIONS.get(agent_id, agent_id),
        )
        for agent_id in AGENT_NAMES
    ]


@app.post("/api/chat")
async def chat(req: ChatRequest):
    """Stream a reply from the matching agent via SSE.

    Event stream: `start` -> `delta` (token-by-token) ... -> `done`.
    On total failure a single generic `error` event is emitted instead.
    """

    if not has_config():
        return EventSourceResponse(
            _error_stream(
                "No AI provider is configured. Add at least one key to backend/.env "
                "(XAI_API_KEY, OPENROUTER_API_KEY or GEMINI_API_KEY) and restart."
            )
        )

    if not req.messages or not any(m.content.strip() for m in req.messages):
        return EventSourceResponse(_error_stream("Send at least one message."))

    return EventSourceResponse(_stream_agent(req.agent_id, req.messages))


# ---------------------------------------------------------------------------
# SSE helpers
# ---------------------------------------------------------------------------
def _sse(event_type: str, data: dict):
    return {"event": event_type, "data": json.dumps(data, ensure_ascii=False)}


async def _stream_agent(agent_id: str, messages):
    """Run the matching agent against each provider in turn until one succeeds.

    No provider identity is ever included in the event stream — the client just
    sees a seamless reply regardless of which provider served it.
    """

    transcript = [
        {"role": m.role, "content": m.content}
        for m in messages
        if m.content and m.content.strip()
    ]
    if not transcript:
        yield _sse("error", {"message": "Message content cannot be empty."})
        return

    yield _sse("start", {"agent": AGENT_NAMES.get(agent_id, agent_id)})

    providers = get_providers()
    last_error: str | None = None
    for provider in providers:
        emitted = ""  # text already forwarded for THIS provider attempt
        emitted_raw = False  # do raw token deltas cover the text for this run?
        try:
            agent = build_agent(agent_id, provider=provider)
            result = Runner.run_streamed(agent, input=transcript)

            async for stream_event in result.stream_events():
                # True token-level deltas from the provider. When these arrive
                # the snapshot path below is disabled so text is never doubled.
                if stream_event.type == "raw_response_event":
                    data = stream_event.data
                    if getattr(data, "type", "") == "response.output_text.delta":
                        delta = getattr(data, "delta", None)
                        if delta:
                            emitted_raw = True
                            yield _sse("delta", {"text": delta})
                    continue

                # Semantic snapshots: forward only the newly appended slice.
                # Used only when the provider never surfaces raw deltas.
                if stream_event.type == "run_item_stream_event":
                    if stream_event.name == "message_output_created":
                        if emitted_raw:
                            continue
                        raw = getattr(stream_event.item, "raw_item", None)
                        if raw is not None:
                            text = _extract_text(raw)
                            if text != emitted:
                                slice_ = text[len(emitted):]
                                if slice_:
                                    yield _sse("delta", {"text": slice_})
                                emitted = text

            yield _sse("done", {"agent": AGENT_NAMES.get(agent_id, agent_id)})
            return  # provider succeeded — do not fall through

        except Exception as exc:  # noqa: BLE001
            last_error = str(exc)
            continue

    # Every provider failed — one generic message, no provider name leaked.
    message = (
        "All AI providers are currently unavailable. Please try again in a moment."
    )
    if os.getenv("DEBUG_AGENT_ERRORS", "").strip():
        message += f" ({last_error})"
    yield _sse("error", {"message": message})


async def _error_stream(message: str):
    yield _sse("error", {"message": message})


def _extract_text(response_message) -> str:
    """Flatten an OpenAI Responses message object into plain text."""
    parts: list[str] = []
    for block in getattr(response_message, "content", []) or []:
        text = getattr(block, "text", None)
        if isinstance(text, str):
            parts.append(text)
    return "".join(parts)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)