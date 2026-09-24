"""Dedicated OpenAI Agents for every SFlyra product & service — with
automatic provider fallback (Grok -> OpenRouter -> Gemini -> optional OpenAI).

Each agent owns a narrow domain and a handcrafted system prompt. The `Agent`
instances are built per provider, so the SAME prompt can be served by any
provider in the chain. If a provider is rate-limited, unreachable or fails, the
backend silently falls through to the next one — the user never sees which
provider answered.

NOTE: this module is intentionally NOT named `agents.py` — it would shadow the
installed `agents` (OpenAI Agents SDK) package when running from the backend dir.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

from agents import Agent, AsyncOpenAI, OpenAIChatCompletionsModel
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


# ---------------------------------------------------------------------------
# Provider config — order = fallback order
# ---------------------------------------------------------------------------
@dataclass
class Provider:
    id: str
    label: str
    client: AsyncOpenAI
    model: str

    def model_object(self) -> OpenAIChatCompletionsModel:
        return OpenAIChatCompletionsModel(model=self.model, openai_client=self.client)


_PROVIDER_SPECS: tuple[dict, ...] = (
    {
        "id": "grok",
        "label": "Grok (xAI)",
        "key_env": "XAI_API_KEY",
        "model_env": "XAI_MODEL",
        "default_model": "grok-4-latest",
        "base_url": "https://api.x.ai/v1",
    },
    {
        "id": "openrouter",
        "label": "OpenRouter",
        "key_env": "OPENROUTER_API_KEY",
        "model_env": "OPENROUTER_MODEL",
        "default_model": "openai/gpt-4o-mini",
        "base_url": "https://openrouter.ai/api/v1",
    },
    {
        "id": "gemini",
        "label": "Gemini (Google)",
        "key_env": "GEMINI_API_KEY",
        "model_env": "GEMINI_MODEL",
        "default_model": "gemini-2.5-flash",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
    },
    {
        "id": "openai",
        "label": "OpenAI",
        "key_env": "OPENAI_API_KEY",
        "model_env": "OPENAI_MODEL",
        "default_model": "gpt-4o-mini",
        "base_url": None,  # official endpoint
    },
)

# Per-provider request/read budget so a hung provider can't stall the conversation.
_TIMEOUT = 60.0


@dataclass
class _ProviderCtx:
    client: AsyncOpenAI
    model: str


_provider_cache: dict[str, _ProviderCtx] = {}


def _make_client(base_url: str | None, api_key: str) -> AsyncOpenAI:
    return AsyncOpenAI(
        api_key=api_key,
        base_url=base_url,
        max_retries=0,  # no auto retries — fall over to the next provider fast
        timeout=_TIMEOUT,
    )


def _resolved(spec: dict) -> _ProviderCtx | None:
    key = os.getenv(spec["key_env"], "").strip()
    if not key:
        return None
    if spec["id"] in _provider_cache:
        return _provider_cache[spec["id"]]
    model = os.getenv(spec["model_env"], "").strip() or spec["default_model"]
    ctx = _ProviderCtx(client=_make_client(spec["base_url"], key), model=model)
    _provider_cache[spec["id"]] = ctx
    return ctx


def get_providers() -> list[Provider]:
    """Configured providers in fallback order (Grok -> OpenRouter -> Gemini -> OpenAI)."""
    providers: list[Provider] = []
    for spec in _PROVIDER_SPECS:
        ctx = _resolved(spec)
        if ctx is not None:
            providers.append(
                Provider(id=spec["id"], label=spec["label"], client=ctx.client, model=ctx.model)
            )
    return providers


def get_provider_labels() -> list[str]:
    return [p.label for p in get_providers()]


# ---------------------------------------------------------------------------
# Shared behaviour blueprint
# ---------------------------------------------------------------------------
_SHARED_TOP_LINE = (
    "You are a helpful AI specialist at SFlyra Labs. Talk in the customer's language. "
    "Keep answers for the live product page: friendly, concrete, and concise (aim for "
    "2\u20135 short paragraphs or a short bulleted list). Use simple examples a business "
    "owner will instantly get. If the user asks about a DIFFERENT SFlyra product or service, "
    "do NOT say you can't help and never call it out of scope \u2014 route them positively instead: "
    "tell them to switch to the right agent in this chat's selector and share the exact page "
    "link where they can hit \"Chat with agent\" (e.g. https://sflyra.site/services/web-development#agent-chat "
    "for websites, https://sflyra.site/products/ai-chatbot#agent-chat for chatbots). "
    "SFlyra offerings \u2014 products: ai-chatbot, email-whatsapp-automation, social-media-auto-poster, "
    "ai-content-writer, ai-automation, agentic-workflows, ai-chatbot-development; services: "
    "web-development, graphic-designing, digital-marketing, video-animation, video-editing."
    "\n\nWHENEVER the user asks how to contact SFlyra Labs, or about pricing, booking a "
    "call, starting a project, or where to follow SFlyra, ALWAYS give these working contact "
    "options with the full clickable Markdown links:\n"
    "- Email: sflyraai@gmail.com\n"
    "- WhatsApp: https://wa.me/923482208865 (fastest — chat directly)\n"
    "- Instagram: https://www.instagram.com/sflyra_labs/ (handle @sflyra_labs)\n"
    "- Facebook: https://www.facebook.com/profile.php?id=61594396690562 (SFlyra Labs)\n"
    "- Website contact form: https://sflyra.site/#contact\n"
    "Write each as a Markdown link, e.g. [Instagram](https://www.instagram.com/sflyra_labs/), "
    "so the user can tap it directly in the chat. Also warmly invite the user to follow "
    "@sflyra_labs on Instagram for product updates."
)


# ---------------------------------------------------------------------------
# Agent factories (each accepts a provider's model object)
# ---------------------------------------------------------------------------
def _ai_chatbot_agent(model) -> Agent:
    return Agent(
        name="AI Chatbot Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="AI chatbot training and deployment") + "\n\n"
            "You specialise in SFlyra's ready-to-deploy AI Chatbot. Cover:\n"
            "- Types: website widget chat vs Instagram DM chatbot vs WhatsApp chatbot.\n"
            "- What it can do: answer FAQs 24/7, qualify leads, book appointments directly in the chat.\n"
            "- How it's trained: business owner uploads FAQs, menus, prices; the agent learns in minutes.\n"
            "- Deployment: no-code, live on the same website in days, embed widget + Instagram integration.\n"
            "- Pricing: no commission on bookings; simple plans; offer to /#contact to start.\n"
            "If asked about custom training on PDFs or CRM lookup, redirect to AI Chatbot Development."
        ),
        model=model,
    )


def _email_whatsapp_agent(model) -> Agent:
    return Agent(
        name="Email & WhatsApp Automation Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="email and WhatsApp automation flows") + "\n\n"
            "You specialise in SFlyra's Email/WhatsApp Automation. Cover:\n"
            "- Workflows: trigger-based sequences for order confirmations, shipping updates, reminders, follow-ups.\n"
            "- Auto-replies: instant WhatsApp responses from business hours rules and keywords.\n"
            "- CRM sync: new leads and replies sync to the customer's CRM/Google Sheets automatically.\n"
            "- Re-engagement: smart follow-ups that re-warm cold leads.\n"
            "- Integration: works with popular WhatsApp Business API providers and email tools.\n"
            "Give a concrete flow example (e.g. 'new order \u2192 confirm \u2192 3-day delivery reminder')."
        ),
        model=model,
    )


def _social_auto_poster_agent(model) -> Agent:
    return Agent(
        name="Social Media Auto-Poster Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="social media scheduling and auto-posting") + "\n\n"
            "You specialise in SFlyra's Social Media Auto-Poster. Cover:\n"
            "- Platforms: Instagram, Facebook, LinkedIn.\n"
            "- Captions: auto-generated in brand voice; thumbnails and hashtags suggested.\n"
            "- Calendar: smart daily posting times; a month of content planned in one sitting.\n"
            "- Automation: drag-and-drop media \u2192 captions drafted \u2192 scheduled \u2192 auto-posted.\n"
            "- Use case examples: restaurants, gyms, coaches, e-commerce stores.\n"
            "Suggest 3 good content pillars a business could schedule weekly."
        ),
        model=model,
    )


def _content_writer_agent(model) -> Agent:
    return Agent(
        name="AI Content Writer Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="AI content writing") + "\n\n"
            "You specialise in SFlyra's AI Content Writer. Cover:\n"
            "- Outputs: blog posts, ad copy, social captions, product descriptions, newsletters.\n"
            "- Brand voice: learns tone and vocabulary from a short sample, consistent output.\n"
            "- Workflow: draft in seconds \u2192 human edits \u2192 export Markdown ready for CMS.\n"
            "- SEO: suggests headings, keywords, meta descriptions.\n"
            "If the user wants a full article, generate a short outline and offer to draft one."
        ),
        model=model,
    )


def _ai_automation_agent(model) -> Agent:
    return Agent(
        name="AI Automation Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="custom AI automation for business operations") + "\n\n"
            "You specialise in SFlyra's AI Automation (custom build). Cover:\n"
            "- Discovery: we map the user's repetitive tasks (lead handling, data entry, reporting, follow-ups).\n"
            "- Integration: works with the tools they already use (Sheets, Notion, Slack, CRMs, email).\n"
            "- Build: handoffs between simple AI steps + human confirmation where needed.\n"
            "- Reporting: plain-language summary of every action the automation takes.\n"
            "Ask 1 clarifying question about their biggest repetitive task before proposing a plan."
        ),
        model=model,
    )


def _agentic_workflows_agent(model) -> Agent:
    return Agent(
        name="Agentic Workflows Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="multi-step agentic workflows") + "\n\n"
            "You specialise in SFlyra's Agentic Workflows (custom build). Cover:\n"
            "- Difference vs simple automation: agents research, decide, and act across tools.\n"
            "- Example flows: researching a market \u2192 drafting outreach \u2192 sending and tracking it.\n"
            "- Guardrails: human checkpoints at the right moments; agent pauses for approval.\n"
            "- Architecture: tools the agent can use, permissions, logging and audit trail.\n"
            "Explain one vivid example end-to-end (e.g. inbound lead \u2192 qualified \u2192 scheduled)."
        ),
        model=model,
    )


def _chatbot_dev_agent(model) -> Agent:
    return Agent(
        name="AI Chatbot Development Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="custom AI chatbot development") + "\n\n"
            "You specialise in SFlyra's AI Chatbot Development (custom build). Cover:\n"
            "- Data training: trained on the customer's documents, PDFs, pricing, knowledge base.\n"
            "- Integrations: CRM, calendar booking, email and WhatsApp.\n"
            "- Handling: answers ~80% of enquiries hands-free; alerts a human only when needed.\n"
            "- Compliance & accuracy: citations, source grounding, no hallucinated pricing.\n"
            "Offer next step: /#contact for a scoping call."
        ),
        model=model,
    )


def _web_dev_agent(model) -> Agent:
    return Agent(
        name="Web Development Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="website and web app development") + "\n\n"
            "You specialise in SFlyra's Web Development service. Cover:\n"
            "- Outputs: marketing sites, online stores, booking pages, dashboards.\n"
            "- Build: fast modern stack, SEO-ready, accessibility, conversion-focused design.\n"
            "- AI assistant: we can embed a trained chat assistant into the site.\n"
            "- Process: scoped proposal in 24h, fixed timeline, analytics + CMS + maintenance.\n"
            "Ask what kind of site they need before proposing a stack."
        ),
        model=model,
    )


def _graphic_design_agent(model) -> Agent:
    return Agent(
        name="Graphic Design Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="brand identity and graphic design") + "\n\n"
            "You specialise in SFlyra's Graphic Designing service. Cover:\n"
            "- Deliverables: logos, full brand identity, social creatives, ad banners, pitch decks.\n"
            "- Process: moodboard \u2192 concepts \u2192 refinements until it feels right.\n"
            "- Kit: every asset exported for all platforms.\n"
            "Suggest what a full brand kit includes for their industry."
        ),
        model=model,
    )


def _digital_marketing_agent(model) -> Agent:
    return Agent(
        name="Digital Marketing Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="digital marketing and social campaigns") + "\n\n"
            "You specialise in SFlyra's Digital Marketing service. Cover:\n"
            "- Scope: social growth, content calendar, paid campaigns, AI-assisted copy & creatives.\n"
            "- Approach: audience research \u2192 funnel \u2192 monthly reporting that's easy to read.\n"
            "- Metrics: healthy ROAS, engagement, follower growth, booking rates.\n"
            "Suggest 2\u20133 quick wins for a new business trying to grow on Instagram."
        ),
        model=model,
    )


def _video_animation_agent(model) -> Agent:
    return Agent(
        name="Video Animation Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="video animation and motion graphics") + "\n\n"
            "You specialise in SFlyra's Video Animation service. Cover:\n"
            "- Outputs: explainer videos, brand story videos, logo & UI motion graphics.\n"
            "- Process: storyboard \u2192 voice-over script \u2192 animation \u2192 sound design, all in-house.\n"
            "- Platform cuts: short-form versions ready for every platform.\n"
            "Give a short storyboard outline for a 45-second explainer."
        ),
        model=model,
    )


def _video_editing_agent(model) -> Agent:
    return Agent(
        name="Video Editing Agent",
        instructions=(
            _SHARED_TOP_LINE.format(scope="video editing and short-form cuts") + "\n\n"
            "You specialise in SFlyra's Video Editing service. Cover:\n"
            "- Outputs: reels, shorts, TikTok edits, ads, podcast clips, long-form.\n"
            "- Craft: pacing that holds attention, captions, colour grading, sound design.\n"
            "- Turnaround: rapid weekly content support.\n"
            "Ask what raw footage they have and the platform they post on."
        ),
        model=model,
    )


def _concierge_agent(model) -> Agent:
    return Agent(
        name="SFlyra Concierge",
        instructions=(
            _SHARED_TOP_LINE.format(
                scope="every SFlyra product and service (you are the whole-site concierge)"
            )
            + "\n\n"
            "You are the SFlyra Concierge — the front-desk guide who knows EVERYTHING SFlyra "
            "Labs offers and every dedicated agent. You run the homepage floating chat widget.\n\n"
            "SFLYRA PRODUCTS (ready-made AI tools — deploy in days):\n"
            "- AI Chatbot — a website/Instagram DM chatbot that answers questions and books leads. [details](https://sflyra.site/products/ai-chatbot#agent-chat)\n"
            "- Email/WhatsApp Automation — auto-replies, order confirmations and follow-up sequences. [details](https://sflyra.site/products/email-whatsapp-automation#agent-chat)\n"
            "- Social Media Auto-Poster — on-brand captions plus scheduling for Instagram, Facebook and LinkedIn. [details](https://sflyra.site/products/social-media-auto-poster#agent-chat)\n"
            "- AI Content Writer — blogs, captions and product descriptions in seconds. [details](https://sflyra.site/products/ai-content-writer#agent-chat)\n"
            "- AI Automation — custom AI that runs back-office workflows. [details](https://sflyra.site/products/ai-automation#agent-chat)\n"
            "- Agentic Workflows — multi-step agents that research, decide and act. [details](https://sflyra.site/products/agentic-workflows#agent-chat)\n\n"
            "SFLYRA SERVICES (custom work delivered for you):\n"
            "- Web Development — fast, SEO-ready websites and stores, optionally with an AI chat assistant. [details](https://sflyra.site/services/web-development#agent-chat)\n"
            "- Graphic Designing — logos, full brand kits and social creatives. [details](https://sflyra.site/services/graphic-designing#agent-chat)\n"
            "- Digital Marketing — social growth, content calendars and paid campaigns. [details](https://sflyra.site/services/digital-marketing#agent-chat)\n"
            "- Video Animation — explainers, motion graphics and brand stories. [details](https://sflyra.site/services/video-animation#agent-chat)\n"
            "- Video Editing — reels, ads and polished short-form cuts. [details](https://sflyra.site/services/video-editing#agent-chat)\n\n"
            "HOW TO RESPOND:\n"
            '1) If the user asks what SFlyra offers — "services", "products" or "what do you do" '
            "— give a COMPLETE overview: all 6 products and all 5 services, ONE short line each, "
            "and for EVERY offering include a clickable routing link as a Markdown link "
            "(e.g. [AI Chatbot](https://sflyra.site/products/ai-chatbot#agent-chat), "
            "[Web Development](https://sflyra.site/services/web-development#agent-chat)). "
            "Mention that every offering has a dedicated agent they can switch to from the "
            "selector at the top of this chat panel. NEVER use Markdown bold (\"**\") or "
            "headings (\"###\") — this chat only renders plain text and Markdown links.\n"
            "2) If the user asks about META or asks for DETAILS of one specific product or service, "
            "give a short 2-3 sentence overview, then HAND OFF with both: (a) tell them to switch to "
            'the dedicated "<Name>" agent using the selector at the top of this chat panel, and (b) '
            "give the exact page link for that offering as a Markdown link with the page's own "
            "\"Chat with agent\" option, e.g. [Web Development — chat with the agent]"
            "(https://sflyra.site/services/web-development#agent-chat) or "
            "[AI Chatbot — chat with the agent](https://sflyra.site/products/ai-chatbot#agent-chat).\n"
            "3) Never say you can't help or that something is out of your scope — SFlyra covers all "
            "of this: you ALWAYS route the user to the right agent/page. Whenever the user wants to "
            "start a project, asks about pricing, booking a call, or anywhere contact details make "
            "sense, give the contact options from your shared instructions (WhatsApp, Instagram, "
            "Facebook, contact form) as clickable links and warmly invite them to follow "
            "@sflyra_labs on Instagram.\n"
            "Keep every answer friendly, concrete and concise — 2-5 short paragraphs or bullet "
            "lists, and always end a handoff with the specific page link."
        ),
        model=model,
    )


# ---------------------------------------------------------------------------
# Concierge routing — deterministic offering detection + ready-to-stream handoff
# ---------------------------------------------------------------------------
# (keywords, offering title, kind (products|services), slug). Ordered most
# specific first so e.g. "custom chatbot development" beats plain "chatbot".
_OFFERINGS: tuple[tuple[tuple[str, ...], str, str, str], ...] = (
    (
        (
            "web development", "web dev", "website", "web site", "web app", "web application",
            "landing page", "online store", "ecommerce", "e-commerce", "shopify", "wordpress",
            "site for my", "website for my business", "build me a site",
        ),
        "Web Development",
        "services",
        "web-development",
    ),
    (
        (
            "ai chatbot development", "custom chatbot", "chatbot development", "build a chatbot",
            "build my chatbot", "develop a chatbot", "develop my own chatbot",
        ),
        "AI Chatbot Development",
        "products",
        "ai-chatbot-development",
    ),
    (
        (
            "chatbot", "ai chat bot", "faq bot", "customer support bot", "lead generation bot",
            "instagram dm bot", "booking bot", "dm bot", "chat bot",
        ),
        "AI Chatbot",
        "products",
        "ai-chatbot",
    ),
    (
        (
            "whatsapp automation", "email automation", "email marketing automation", "auto reply",
            "auto-reply", "follow-up email", "follow up email", "follow-up sequence", "crm sync",
            "whatsapp message", "whatsapp flow", "email sequence",
        ),
        "Email/WhatsApp Automation",
        "products",
        "email-whatsapp-automation",
    ),
    (
        (
            "social media auto", "auto poster", "auto-post", "post scheduling", "schedule posts",
            "social media scheduling", "captions for instagram", "auto post", "auto-posting",
            "content calendar for social",
        ),
        "Social Media Auto-Poster",
        "products",
        "social-media-auto-poster",
    ),
    (
        (
            "content writer", "content writing", "blog", "blog post", "product description",
            "ad copy", "write captions", "copywriting",
        ),
        "AI Content Writer",
        "products",
        "ai-content-writer",
    ),
    (
        (
            "ai automation", "automate", "automation flow", "back office", "workflow automation",
            "automation for my",
        ),
        "AI Automation",
        "products",
        "ai-automation",
    ),
    (
        (
            "agentic", "multi-step", "multi step", "autonomous agent", "research agent",
            "agents that act",
        ),
        "Agentic Workflows",
        "products",
        "agentic-workflows",
    ),
    (
        (
            "graphic design", "graphic designing", "logo", "brand kit", "branding",
            "brand identity", "social media creatives", "poster design", "flyer", "banner",
        ),
        "Graphic Designing",
        "services",
        "graphic-designing",
    ),
    (
        (
            "digital marketing", "marketing", "social growth", "paid ads", "google ads",
            "instagram growth", "content calendar", "run ads", "ad campaign", "monthly marketing",
        ),
        "Digital Marketing",
        "services",
        "digital-marketing",
    ),
    (
        (
            "video animation", "animation", "explainer", "motion graphics", "brand story video",
            "whiteboard video", "animated",
        ),
        "Video Animation",
        "services",
        "video-animation",
    ),
    (
        (
            "video editing", "editing my", "reels", "shorts", "tiktok", "podcast clip",
            "youtube edit", "short-form", "short form", "edit videos",
        ),
        "Video Editing",
        "services",
        "video-editing",
    ),
)


def _concierge_handoff(query: str) -> str | None:
    """Deterministically detect which SFlyra offering the user is asking about and
    return a ready-to-stream handoff message (page link + live 'Chat with agent'
    + direct contact info). Returns None when no offering is detected so the LLM
    answers the conversation naturally."""
    q = query.lower()
    for keywords, title, kind, slug in _OFFERINGS:
        if any(kw in q for kw in keywords):
            page = f"https://sflyra.site/{kind}/{slug}#agent-chat"
            return (
                f"Yes, we handle that — it's our {title} offering.\n\n"
                f"Open the {title} page → [{title} — chat with the live agent]({page}) and hit the "
                f"\"Chat with agent\" button there to talk to that specialist directly (or to our "
                f"team). You can also switch to the {title} agent right here from the selector at "
                f"the top of this panel.\n\n"
                f"Prefer to talk to us directly? Here's everything:\n"
                f"- Email: sflyraai@gmail.com\n"
                f"- WhatsApp: [Chat on WhatsApp](https://wa.me/923482208865) — fastest reply\n"
                f"- Instagram: [@sflyra_labs](https://www.instagram.com/sflyra_labs/)\n"
                f"- Facebook: [SFlyra Labs](https://www.facebook.com/profile.php?id=61594396690562)\n"
                f"- Contact form: [Contact Us](https://sflyra.site/#contact)\n\n"
                f"Want me to explain a bit more about {title} first?"
            )
    return None


# One-line descriptions used in the deterministic "what do you offer" overview.
# (title, kind (products|services), slug, one-line description)
_OFFERINGS_LINES: tuple[tuple[str, str, str, str], ...] = (
    (
        "AI Chatbot", "products", "ai-chatbot",
        "automatic responses and lead capture on your website or Instagram DMs",
    ),
    (
        "Email/WhatsApp Automation", "products", "email-whatsapp-automation",
        "auto-replies, order confirmations and follow-up sequences",
    ),
    (
        "Social Media Auto-Poster", "products", "social-media-auto-poster",
        "schedule posts and auto-generate captions for Instagram, Facebook and LinkedIn",
    ),
    (
        "AI Content Writer", "products", "ai-content-writer",
        "blogs, captions and product descriptions in seconds",
    ),
    (
        "AI Automation", "products", "ai-automation",
        "custom AI that runs your back-office workflows on autopilot",
    ),
    (
        "Agentic Workflows", "products", "agentic-workflows",
        "multi-step agents that research, decide and act across your tools",
    ),
    (
        "Web Development", "services", "web-development",
        "fast, SEO-ready websites and stores, optionally with an AI chat assistant",
    ),
    (
        "Graphic Designing", "services", "graphic-designing",
        "logos, full brand kits and social media creatives",
    ),
    (
        "Digital Marketing", "services", "digital-marketing",
        "social growth, content calendars and paid campaigns",
    ),
    (
        "Video Animation", "services", "video-animation",
        "explainer videos and motion graphics for your brand",
    ),
    (
        "Video Editing", "services", "video-editing",
        "polished reels, ads and short-form cuts",
    ),
)

_OVERVIEW_INTENT = (
    "what do you offer", "what do you do", "what services", "what products",
    "services and products", "products and services", "your services", "your products",
    "all services", "all products", "list of services", "list of products", "offerings",
    "catalogue", "catalog", "everything you offer", "what can you do", "what can you help",
    "tell me about your services", "tell me about your products", "what are your services",
    "what are your products", "what is sflyra", "what does sflyra do", "about sflyra",
)


def _concierge_overview(query: str) -> str | None:
    """Deterministically answer the whole-catalog question with a clean list:
    every product/service in ONE line plus its clickable routing link, so the
    client immediately sees what SFlyra offers and where to go for details."""
    q = query.lower()
    if not any(p in q for p in _OVERVIEW_INTENT):
        return None

    def _block(items: list) -> str:
        return "\n".join(
            f"{i}. {title} — {desc}. [Chat with agent](https://sflyra.site/{kind}/{slug}#agent-chat)"
            for i, (title, kind, slug, desc) in enumerate(items, 1)
        )

    products = _block([row for row in _OFFERINGS_LINES if row[1] == "products"])
    services = _block([row for row in _OFFERINGS_LINES if row[1] == "services"])

    return (
        "Here's everything SFlyra Labs offers — each one has a dedicated agent you can "
        "switch to from the selector at the top, and a page with its own live \"Chat with "
        "agent\". Tap a link to go straight there:\n\n"
        f"PRODUCTS:\n{products}\n\n"
        f"SERVICES:\n{services}\n\n"
        "Which one would you like details on? I'll dive in and route you to that specialist."
    )


# ---------------------------------------------------------------------------
# Registry — id -> factory
# ---------------------------------------------------------------------------
_FACTORIES: dict[str, callable] = {
    # Whole-site guide (default for the homepage floating chat)
    "sflyra-concierge": _concierge_agent,
    # Products
    "ai-chatbot": _ai_chatbot_agent,
    "email-whatsapp-automation": _email_whatsapp_agent,
    "social-media-auto-poster": _social_auto_poster_agent,
    "ai-content-writer": _content_writer_agent,
    "ai-automation": _ai_automation_agent,
    "agentic-workflows": _agentic_workflows_agent,
    "ai-chatbot-development": _chatbot_dev_agent,
    # Services
    "web-development": _web_dev_agent,
    "graphic-designing": _graphic_design_agent,
    "digital-marketing": _digital_marketing_agent,
    "video-animation": _video_animation_agent,
    "video-editing": _video_editing_agent,
}

DEFAULT_AGENT_ID = "ai-chatbot"

# Name lookup for the /api/agents listing (independent of any provider)
AGENT_NAMES = {agent_id: _FACTORIES[agent_id](None).name for agent_id in _FACTORIES}


def build_agent(agent_id: str, provider: Provider | None = None) -> Agent:
    """Build the requested agent. If a provider is given, its model is used;
    otherwise the first configured provider is picked."""
    factory = _FACTORIES.get(agent_id, _FACTORIES[DEFAULT_AGENT_ID])
    if provider is not None:
        return factory(provider.model_object())
    providers = get_providers()
    if providers:
        return factory(providers[0].model_object())
    return factory(None)


def get_agent(agent_id: str, provider: Provider | None = None) -> Agent:
    """Backwards-compatible alias for build_agent."""
    return build_agent(agent_id, provider=provider)


def has_config() -> bool:
    return bool(get_providers())