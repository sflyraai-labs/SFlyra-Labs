import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bot, RefreshCcw, Send, Sparkles } from "lucide-react";

import { StatusPill } from "@/components/site/site-ui";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

/**
 * SFlyra AI backend base URL.
 *
 * Resolution order:
 *   1. VITE_SFLYRA_API env var (set in Vercel/CI, or locally, to override)
 *   2. Hosted backend — used in production AND local dev so the chat works
 *      out of the box without running a local FastAPI server. Point
 *      VITE_SFLYRA_API at your own backend if you need to override.
 */
const HOSTED_API = "https://backend-iota-one-27.vercel.app";
const API_BASE = (() => {
  const fromEnv =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.["VITE_SFLYRA_API"] as string | undefined)?.replace(/\/+$/, "")
      : undefined;
  return fromEnv || HOSTED_API;
})();

const SUGGESTION_MAP: Record<string, string[]> = {
  "ai-chatbot": [
    "What types of chatbot can you build?",
    "How long does deployment take?",
    "Can it book appointments?",
  ],
  "email-whatsapp-automation": [
    "Show me a WhatsApp flow example",
    "Does it sync to my CRM?",
    "How do auto-replies work?",
  ],
  "social-media-auto-poster": [
    "Which platforms do you support?",
    "How are captions generated?",
    "Can I plan a month ahead?",
  ],
  "ai-content-writer": [
    "What can it write?",
    "Does it learn my brand voice?",
    "Show me an outline",
  ],
  "ai-automation": [
    "What can it automate?",
    "Will it connect my tools?",
    "How does reporting work?",
  ],
  "agentic-workflows": [
    "How is this different from automation?",
    "Give me a real example",
    "Where are human checkpoints?",
  ],
  "web-development": [
    "What kind of sites do you build?",
    "Do you include an AI chat assistant?",
    "What's the timeline?",
  ],
  "graphic-designing": [
    "What's in a full brand kit?",
    "How do revisions work?",
    "What files do I get?",
  ],
  "digital-marketing": [
    "Give me quick wins on Instagram",
    "Do you run paid ads?",
    "How do you report results?",
  ],
  "video-animation": [
    "Can you make explainer videos?",
    "What does the process look like?",
    "Do you do voice-over too?",
  ],
  "video-editing": [
    "What formats do you edit?",
    "How fast is the turnaround?",
    "Do you add captions and sound?",
  ],
};

const DEFAULT_SUGGESTIONS = [
  "What can you help me with?",
  "How quick is this to set up?",
  "What's the next step?",
];

function StatusDot({ offline = false }: { offline?: boolean }) {
  return offline ? (
    <span className="relative flex h-2 w-2">
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
    </span>
  ) : (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]" />
    </span>
  );
}

/**
 * Streaming reader for Server-Sent Events consumed via fetch (POST body support).
 */
async function readSSE(res: Response, onEvent: (event: string, data: string) => void) {
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let data = "";

  const flush = () => {
    if (data.trim()) onEvent(eventName, data);
    eventName = "message";
    data = "";
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("event:")) {
        eventName = trimmed.slice(6).trim();
      } else if (trimmed.startsWith("data:")) {
        data += (data ? "\n" : "") + trimmed.slice(5).trim();
      } else if (trimmed === "") {
        flush();
      }
    }
  }
  flush();
}

export function AgentChatPanel({
  agentId,
  agentName,
  streaming = true,
}: {
  agentId: string;
  agentName: string;
  streaming?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState<"checking" | "online" | "offline">("checking");

  const draftRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef(false);

  const suggestions = SUGGESTION_MAP[agentId] ?? DEFAULT_SUGGESTIONS;

  useEffect(() => {
    let disposed = false;
    let retryTimer: number | undefined;

    /**
     * Health check with retries so a transient backend cold-start or network
     * blip doesn't permanently mark the agent as "Offline". Each attempt is
     * time-bounded so the badge never hangs on "Connecting" forever.
     */
    const attempt = async (tryCount: number) => {
      const ctrl = new AbortController();
      const timeout = window.setTimeout(() => ctrl.abort(), 4000);
      try {
        const res = await fetch(`${API_BASE}/api/health`, { signal: ctrl.signal });
        if (disposed) return;
        if (res.ok || tryCount >= 3) {
          setOnline(res.ok ? "online" : "offline");
        } else {
          retryTimer = window.setTimeout(() => void attempt(tryCount + 1), tryCount * 800 + 400);
        }
      } catch {
        if (disposed) return;
        if (tryCount >= 3) {
          setOnline("offline");
        } else {
          retryTimer = window.setTimeout(() => void attempt(tryCount + 1), tryCount * 800 + 400);
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

    void attempt(0);
    return () => {
      disposed = true;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, input]);

  const stop = () => {
    abortRef.current?.abort();
  };

  const ask = async (text: string) => {
    const content = (text ?? input).trim();
    // Optimistic: only block once the backend is confirmed unreachable, so
    // the panel stays usable while the health probe is still running.
    const blocked = online === "offline";
    if (!content || thinking || blocked) return;

    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setError(null);
    setThinking(true);
    draftRef.current = "";
    streamingRef.current = true;

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const bringLiving = () => {
      if (!streamingRef.current) return;
      const living = draftRef.current;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === "assistant") {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: living };
          return next;
        }
        return [...prev, { role: "assistant", content: living }];
      });
    };

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, messages: history }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        try {
          const j = await res.json();
          detail = j.detail ?? detail;
        } catch {
          /* ignore */
        }
        setError(detail);
        setThinking(false);
        return;
      }

      await readSSE(res, (event, data) => {
        if (event === "start") {
          return;
        }
        if (event === "delta") {
          let parsed: { text?: string } = {};
          try {
            parsed = JSON.parse(data) as { text?: string };
          } catch {
            /* ignore */
          }
          if (parsed.text) {
            draftRef.current += parsed.text;
            bringLiving();
          }
          return;
        }
        if (event === "error") {
          let parsed: { message?: string } = {};
          try {
            parsed = JSON.parse(data) as { message?: string };
          } catch {
            /* ignore */
          }
          setError(parsed.message ?? "Something went wrong.");
          return;
        }
        if (event === "done") {
          setThinking(false);
        }
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setThinking(false);
        return;
      }
      setError("Could not reach the agent. Please check your connection and try again.");
      setThinking(false);
    } finally {
      abortRef.current = null;
      streamingRef.current = false;
      setThinking(false);
    }
  };

  const reset = () => {
    stop();
    setMessages([]);
    setError(null);
    setThinking(false);
    draftRef.current = "";
    streamingRef.current = false;
  };

  return (
    <div className="overflow-hidden rounded-3xl glass-panel glow-soft">
      {/* Chrome header */}
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="ml-2 flex min-w-0 items-center gap-2">
          <Bot className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate text-[11px] font-semibold tracking-wide text-muted-foreground">
            {agentName}
          </span>
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-wider uppercase sm:inline-flex ${
              online === "online"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                : online === "offline"
                  ? "border-red-500/30 bg-red-500/10 text-red-500"
                  : "border-border bg-card/60 text-muted-foreground"
            }`}
          >
            <StatusDot offline={online === "offline"} />
            {online === "online" ? "Live" : online === "offline" ? "Offline" : "Connecting"}
          </span>
          <button
            onClick={reset}
            aria-label="Reset conversation"
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition hover:bg-border/60 hover:text-foreground"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-80 space-y-3 overflow-y-auto px-4 py-4 sm:h-96">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold">Ask me anything about {agentName}.</p>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              I'm the dedicated SFlyra agent for this page — type a question or tap a quick prompt
              below.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <Bubble key={i} message={m} />
        ))}

        {thinking && (
          <div className="flex items-end gap-2">
            <Avatar />
            <div className="glass-panel rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 0 && online !== "offline" && (
        <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => void ask(s)}
              className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mx-4 mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs leading-relaxed text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/60 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(input);
              }
            }}
            placeholder={
              online === "offline"
                ? "Agent unreachable — try again shortly"
                : thinking
                  ? "Agent is replying…"
                  : "Type your question…"
            }
            disabled={online === "offline" || thinking}
            className="min-w-0 flex-1 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-4 focus:ring-primary/15 disabled:opacity-50"
          />
          <button
            onClick={() => void ask(input)}
            disabled={!input.trim() || thinking || online === "offline"}
            aria-label="Send message"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-lg shadow-primary/25 transition hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders assistant text with clickable links.
 * Supports Markdown links ([text](url)) and raw https:// URLs.
 */
function linkify(text: string): ReactNode[] {
  const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const href = m[2] ?? m[0].replace(/[,.;:!?)]+$/, "");
    const label = m[1] ?? m[0];
    nodes.push(
      <a
        key={key++}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-highlight hover:decoration-highlight/60"
      >
        {label}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Bubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white shadow-md shadow-primary/15"
          style={{ background: "var(--gradient-primary)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      <Avatar />
      <div className="glass-panel max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
        {linkify(message.content)}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
      <Bot className="h-4 w-4" />
    </span>
  );
}
