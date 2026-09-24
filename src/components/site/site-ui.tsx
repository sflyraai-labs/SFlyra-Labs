import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Minus,
  Monitor,
  Moon,
  Pause,
  Play,
  Plus,
  Send,
  Smartphone,
  Sun,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import logoPhoto from "@/assets/sflyra-logo.jpg";
import type { DemoKind } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * WhatsApp contact number (international format, no "+" or spaces).
 * +92 03482208865 -> 92 3482208865. Every wa.me link on the site
 * (footer, contact section, chat links) updates from this one value.
 */
export const WHATSAPP_NUMBER = "923482208865";

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Brand WhatsApp glyph (not in lucide). */
export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Newsletter subscribe box — posts to the same FormSubmit inbox as the contact form. */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/sflyraai@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "SFlyra newsletter subscription",
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error(`FormSubmit responded with ${res.status}`);
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-600 sm:text-sm dark:text-emerald-300">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/20">
          <Send className="h-3 w-3" />
        </span>
        You&apos;re in! We&apos;ll share launches &amp; early access.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="w-full rounded-full border border-border bg-card/60 py-2.5 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/15"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className={`relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-[image:var(--gradient-primary)] px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70 ${
          compact ? "sm:px-4" : "sm:px-5"
        }`}
      >
        {status === "sending" ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
        ) : (
          <>
            Subscribe
            {!compact && <Send className="-ml-1 h-3.5 w-3.5" />}
          </>
        )}
      </button>
    </form>
  );
}

export const NAV = [
  { label: "Services", href: "#services" },
  { label: "SFlyra", href: "#product" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export function Wordmark({ href = "#top" }: { href?: string }) {
  return (
    <a href={href} className="flex min-w-0 items-center gap-3">
      <span className="relative shrink-0">
        <img
          src={logoPhoto}
          alt="SFlyra Labs logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl object-cover ring-1 ring-primary/30"
        />
        <span className="absolute inset-0 -z-10 rounded-xl bg-primary/20 blur-md" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-lg leading-none font-semibold">
          SFlyra Labs
        </span>
        <span className="block truncate text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          Intelligence Fused
        </span>
      </span>
    </a>
  );
}

export function PrimaryButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 animate-cta-pulse ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_120%,rgba(255,255,255,0.35),transparent_55%)]"
      />
      <span className="relative shrink-0">{children}</span>
      <ArrowRight
        aria-hidden
        className="relative -ml-2 h-4 w-0 shrink-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-0 group-hover:w-4 group-hover:opacity-100"
      />
    </a>
  );
}

export function GhostButton({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary/10"
    >
      <span className="shrink-0">{children}</span>
      <ArrowRight
        aria-hidden
        className="-ml-2 h-4 w-0 shrink-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-0 group-hover:w-4 group-hover:opacity-100 group-hover:text-primary"
      />
    </a>
  );
}

export function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[10px] font-semibold tracking-wider text-emerald-600 uppercase sm:text-[11px] dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]" />
      </span>
      Agents Active
    </span>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("sflyra-theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light mode" : "Dark mode"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:text-primary"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`group relative h-full overflow-hidden rounded-3xl ${className}`}>
      <div
        className="transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: "perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
          e.currentTarget.style.setProperty("--rx", `${((py - 0.5) * -6).toFixed(2)}deg`);
          e.currentTarget.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.setProperty("--mx", "50%");
          e.currentTarget.style.setProperty("--my", "50%");
          e.currentTarget.style.setProperty("--rx", "0deg");
          e.currentTarget.style.setProperty("--ry", "0deg");
        }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(0,240,255,0.9), rgba(0,102,255,0.5) 45%, transparent 75%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(0,240,255,0.12), transparent 65%)",
        }}
      />
    </article>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-[0.3em] text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export function ChatActionLink({
  to,
  params,
  label = "Chat with AI Agent",
  className,
}: {
  to: string;
  params: Record<string, string>;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      params={params}
      hash="agent-chat"
      className={cn(
        "group/chat pointer-events-auto relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
        "border border-primary/40 bg-primary/10 text-primary",
        "shadow-[0_0_12px_rgba(0,240,255,0.18)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,240,255,0.55)]",
        className,
      )}
    >
      <Bot className="h-3.5 w-3.5 transition-transform duration-300 group-hover/chat:scale-110" />
      {label}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/chat:translate-x-0.5" />
    </Link>
  );
}

export function Navbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "glass-panel border-x-0 border-t-0 shadow-lg" : "border-transparent"
      }`}
    >
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Wordmark />
        <div className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-foreground">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <PrimaryButton href="#contact" className="px-5 py-2.5 text-xs sm:text-sm">
              Start a project
            </PrimaryButton>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function PageBar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "glass-panel border-x-0 border-t-0 shadow-lg" : "border-transparent"
      }`}
    >
      <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Wordmark href="/" />
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Back to home
          </a>
          <ThemeToggle />
          <PrimaryButton href="/#contact" className="px-5 py-2.5 text-xs sm:text-sm">
            Start a project
          </PrimaryButton>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8">
          {/* Brand */}
          <div>
            <Wordmark href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A premium digital agency for web development, AI automation and agentic workflows —
              and the makers of SFlyra.
            </p>
          </div>

          {/* Company links */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  hash="services"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  hash="product"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  SFlyra
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  hash="team"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  hash="contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter + socials */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              AI insights, monthly
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Product updates and automation ideas — no spam, ever.
            </p>
            <div className="mt-4 max-w-sm">
              <NewsletterForm />
            </div>
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/sflyra_labs/"
                target="_blank"
                rel="noreferrer"
                aria-label="SFlyra Labs on Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594396690562"
                target="_blank"
                rel="noreferrer"
                aria-label="SFlyra Labs on Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={whatsappHref("Hi SFlyra Labs!")}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat with SFlyra Labs on WhatsApp"
                className="grid h-9 w-9 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 transition-colors hover:bg-emerald-500/20 sm:text-emerald-500 dark:text-emerald-300"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:sflyraai@gmail.com"
                aria-label="Email SFlyra Labs"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SFlyra Labs. Building Intelligence. Fusing Ideas.</p>
          <p>Made with intent in Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── Interactive demo sandbox ───────────────────────── */

const PALETTES = [
  { name: "Electric Cyan", hex: "#00f0ff" },
  { name: "Deep Blue", hex: "#0066ff" },
  { name: "Dark Emerald", hex: "#0f766e" },
  { name: "Slate Ink", hex: "#0b1220" },
];

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
      <span className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
      </span>
      <span className="ml-2 text-[11px] font-semibold tracking-wide text-muted-foreground">
        {title}
      </span>
      <StatusPill />
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase">
        {label}
        <span className="text-foreground normal-case">{value}s</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--primary)]"
      />
    </label>
  );
}

export function DemoPanel({ kind }: { kind: DemoKind }) {
  const [toggles, setToggles] = useState({ autoReply: true, dailyReport: false });
  const [logs] = useState<string[]>([
    "[09:00] Agent online — monitoring inbox",
    "[09:02] Qualified lead moved to CRM · score 91",
    "[09:05] Drafted reply — awaiting approval",
  ]);
  const [webHeading, setWebHeading] = useState("Your next website, minus the busywork.");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [palette, setPalette] = useState(0);
  const [metrics, setMetrics] = useState({ leads: 128, replies: 96, booked: 24 });
  const [playing, setPlaying] = useState(false);
  const [trim, setTrim] = useState({ start: 12, end: 38 });

  const renderBody = () => {
    switch (kind) {
      case "web-dev":
        return (
          <div className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                Live headline
              </p>
              <input
                value={webHeading}
                onChange={(e) => setWebHeading(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-card/70 px-3 py-2 text-sm font-medium outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDevice("desktop")}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  device === "desktop"
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  device === "mobile"
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>
            <div
              className={`mx-auto overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-300 ${
                device === "desktop" ? "max-w-sm" : "max-w-[11rem]"
              }`}
            >
              <div className="h-2 bg-[image:var(--gradient-primary)]" />
              <div className="p-4">
                <span className="text-[9px] font-semibold tracking-wider text-primary uppercase">
                  SFlyra Labs
                </span>
                <p className="mt-1 font-display text-sm leading-snug font-semibold">
                  {webHeading || "Untitled"}
                </p>
                <div className="mt-3 flex gap-1.5">
                  <span className="h-1.5 w-10 rounded-full bg-primary/70" />
                  <span className="h-1.5 w-7 rounded-full bg-primary/30" />
                  <span className="h-1.5 w-8 rounded-full bg-primary/50" />
                </div>
              </div>
            </div>
          </div>
        );
      case "design":
        return (
          <div className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              {PALETTES.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPalette(i)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    palette === i
                      ? "border-primary/50 bg-primary/10"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-black/10"
                    style={{ background: p.hex }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
            <div
              className="flex aspect-video items-center justify-center rounded-xl border border-border/80 transition-colors duration-300"
              style={{ background: PALETTES[palette]?.hex ?? "#0066ff" }}
            >
              <span className="rounded-full bg-white/90 px-4 py-2 font-display text-sm font-bold text-slate-900">
                SFlyra
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Click a color and watch the brand preview update instantly.
            </p>
          </div>
        );
      case "marketing":
        return (
          <div className="grid grid-cols-3 gap-3 p-5">
            {(
              [
                ["Leads", "leads"],
                ["Replies", "replies"],
                ["Booked", "booked"],
              ] as const
            ).map(([label, key]) => (
              <div key={key} className="rounded-xl border border-border/80 bg-card p-4 text-center">
                <p className="font-display text-3xl font-bold text-primary">{metrics[key]}</p>
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground uppercase">
                  {label}
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  <button
                    onClick={() => setMetrics((m) => ({ ...m, [key]: Math.max(0, m[key] - 1) }))}
                    className="grid h-6 w-6 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setMetrics((m) => ({ ...m, [key]: m[key] + 1 }))}
                    className="grid h-6 w-6 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "video":
        return (
          <div className="space-y-4 p-5">
            <button
              onClick={() => setPlaying((v) => !v)}
              className={`relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 transition ${
                playing ? "bg-[image:var(--gradient-primary)]" : "bg-black/80"
              }`}
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-full bg-white/90 text-slate-900 ${
                  playing ? "animate-pulse" : ""
                }`}
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
              </span>
              <span className="absolute top-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                {playing ? "REC" : "STILL"}
              </span>
            </button>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-700 ${
                  playing ? "w-3/4" : "w-1/4"
                }`}
              />
            </div>
          </div>
        );
      case "editing":
        return (
          <div className="space-y-5 p-5">
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-4 py-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Final cut
              </span>
              <span className="font-display text-lg font-bold text-primary">
                {trim.end - trim.start}s
              </span>
            </div>
            <Slider
              label="Trim start"
              value={trim.start}
              min={0}
              max={20}
              onChange={(v) => setTrim((t) => ({ ...t, start: Math.min(v, t.end - 4) }))}
            />
            <Slider
              label="Trim end"
              value={trim.end}
              min={22}
              max={60}
              onChange={(v) => setTrim((t) => ({ ...t, end: Math.max(v, t.start + 4) }))}
            />
            <div className="h-3 overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-[image:var(--gradient-primary)]"
                style={{
                  width: `${((trim.end - trim.start) / 60) * 100}%`,
                  marginLeft: `${(trim.start / 60) * 100}%`,
                }}
              />
            </div>
          </div>
        );
      case "console":
        return (
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-3">
              {(
                [
                  ["Auto-reply", "autoReply"],
                  ["Daily report", "dailyReport"],
                ] as const
              ).map(([label, key]) => (
                <button
                  key={key}
                  onClick={() => setToggles((t) => ({ ...t, [key]: !t[key] }))}
                  className="flex w-full items-center justify-between rounded-xl border border-border/80 bg-card px-4 py-3 text-left transition hover:border-primary/40"
                >
                  <span className="text-sm font-semibold">{label}</span>
                  <span
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      toggles[key] ? "bg-primary/80" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                        toggles[key] ? "left-4.5" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
              ))}
              <p className="text-[11px] text-muted-foreground">
                {toggles.autoReply
                  ? "Auto-reply is ON — every message gets answered in seconds."
                  : "Auto-reply off — messages queue for a human."}
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-3">
              <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase">
                <Bot className="h-3.5 w-3.5 text-primary" /> Agent log
              </p>
              <ul className="space-y-1.5 font-mono text-[11px] leading-relaxed text-foreground">
                {logs.map((line) => (
                  <li key={line} className="truncate">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl glass-panel glow-soft">
      <WindowChrome title={kind === "console" ? "SFlyra console" : "Live sandbox"} />
      {renderBody()}
    </div>
  );
}
