import { useEffect, useRef, useState } from "react";
import { Bot, MessageSquare, X } from "lucide-react";

import { AgentChatPanel } from "@/components/site/agent-chat";

/** Every agent sold by SFlyra — pick one to talk to. */
const AGENTS = [
  { id: "sflyra-concierge", name: "SFlyra Concierge — whole site" },
  { id: "ai-chatbot", name: "AI Chatbot" },
  { id: "email-whatsapp-automation", name: "Email/WhatsApp Automation" },
  { id: "social-media-auto-poster", name: "Social Media Auto-Poster" },
  { id: "ai-content-writer", name: "AI Content Writer" },
  { id: "ai-automation", name: "AI Automation" },
  { id: "agentic-workflows", name: "Agentic Workflows" },
  { id: "ai-chatbot-development", name: "AI Chatbot Development" },
  { id: "web-development", name: "Web Development" },
  { id: "graphic-designing", name: "Graphic Design" },
  { id: "digital-marketing", name: "Digital Marketing" },
  { id: "video-animation", name: "Video Animation" },
  { id: "video-editing", name: "Video Editing" },
];

/**
 * Floating chat launcher for the home page — bottom-right button that opens a
 * full agent chat panel. Visitors can pick any SFlyra agent from the dropdown.
 */
export function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState("sflyra-concierge");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const agentName = AGENTS.find((a) => a.id === agentId)?.name ?? "SFlyra Agent";

  return (
    <>
      {/* Launcher button */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Chat with SFlyra"}
        onClick={() => setOpen((v) => !v)}
        className="group fixed right-4 bottom-4 z-[70] grid h-14 w-14 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/20 [animation-duration:2.5s]" />
        <span className="absolute inset-0 -z-10 rounded-full bg-[image:var(--gradient-primary)] blur-md opacity-40" />
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed right-4 bottom-20 z-[70] w-[calc(100vw-2rem)] max-w-[380px] sm:right-6 sm:bottom-24"
        >
          <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Agent picker header */}
            <div className="flex items-center gap-2 border-b border-border/70 bg-card/60 px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </span>
              <label className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[9px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Talk to
                </span>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full cursor-pointer truncate bg-transparent text-sm font-semibold text-foreground outline-none"
                >
                  {AGENTS.map((a) => (
                    <option key={a.id} value={a.id} className="bg-card text-foreground">
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <AgentChatPanel agentId={agentId} agentName={agentName} />
          </div>
        </div>
      )}
    </>
  );
}
