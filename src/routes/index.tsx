import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Moon,
  Send,
  Sparkle,
  Sun,
  User,
  Workflow,
} from "lucide-react";
import { animate, motion, useInView } from "framer-motion";

import logoPhoto from "@/assets/sflyra-logo.jpg";
import fatimahPhoto from "@/assets/fatimah.jpg";
import sumiyaPhoto from "@/assets/sumi.jpg";
import { Sparkles, SparkleBurst } from "@/components/site/Sparkles";
import {
  ChatActionLink,
  NewsletterForm,
  SiteFooter,
  WhatsAppIcon,
  whatsappHref,
} from "@/components/site/site-ui";
import { FloatingChatWidget } from "@/components/site/floating-chat";
import { DemoVideo } from "@/components/site/demo-video";
import { PRODUCTS, SERVICES } from "@/lib/catalog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SFlyra Labs — Building Intelligence. Fusing Ideas." },
      {
        name: "description",
        content:
          "SFlyra Labs is a premium digital agency for web development, AI automation and agentic workflows — and the makers of SFlyra.",
      },
      { property: "og:title", content: "SFlyra Labs — Building Intelligence. Fusing Ideas." },
      {
        property: "og:description",
        content:
          "Web development, AI automation and agentic workflows from SFlyra Labs, makers of SFlyra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Services", href: "#services" },
  { label: "SFlyra", href: "#product" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

function Wordmark() {
  return (
    <a href="#top" className="flex min-w-0 items-center gap-3">
      <span className="relative shrink-0">
        <img
          src={logoPhoto}
          alt="SFlyra Labs logo"
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl object-cover ring-1 ring-primary/30"
        />
        <span className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />
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

function PrimaryButton({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
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

function GhostButton({ children, href }: { children: React.ReactNode; href: string }) {
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

function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: React.ReactNode;
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

function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-3xl ${className}`}>
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
      {/* cursor-following gradient border ring */}
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
      {/* soft fill glow trailing the cursor */}
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

function StatusPill() {
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

function ThemeToggle() {
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

function Navbar() {
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

const AI_NODES = [
  { label: "LLM", style: { left: "-4%", top: "34%" }, animate: "animate-float" },
  { label: "NLP", style: { right: "-6%", top: "26%" }, animate: "animate-float-delayed" },
  { label: "API", style: { left: "32%", bottom: "2%" }, animate: "animate-float-slow" },
  { label: "AUTO", style: { right: "2%", bottom: "18%" }, animate: "animate-float-delayed" },
];

function LogoPanel({ burst = false }: { burst?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-[-12%] rounded-full bg-primary/15 blur-3xl animate-pulse-glow" />
      <div className="absolute inset-[-6%] rounded-full bg-[#0066ff]/10 blur-2xl animate-pulse-glow" />
      <div className="absolute inset-0 rounded-full border border-primary/25 animate-spin-slow">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight shadow-[0_0_12px_2px_currentColor]" />
      </div>
      <div className="absolute inset-[9%] rounded-full border border-secondary/25 animate-spin-reverse">
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_currentColor]" />
      </div>
      <div className="absolute inset-[18%] overflow-hidden rounded-full ring-1 ring-primary/30 glow-strong">
        <img
          src={logoPhoto}
          alt="SFlyra Labs — winged SF monogram"
          className="h-full w-full scale-110 object-cover"
        />
      </div>

      {/* Floating AI node chips orbiting the logo */}
      {AI_NODES.map((n) => (
        <span
          key={n.label}
          aria-hidden
          className={`${n.animate} absolute z-10 hidden rounded-full border border-primary/30 bg-card/70 px-3 py-1 text-[10px] font-semibold tracking-wider text-highlight backdrop-blur-md shadow-[0_0_16px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)] sm:inline-block`}
          style={n.style}
        >
          {n.label}
        </span>
      ))}

      {/* Mini simulated workflow chip */}
      <div className="animate-float-slow absolute -top-4 -right-2 z-10 hidden items-center gap-2 rounded-2xl border border-primary/30 bg-card/70 px-4 py-2.5 backdrop-blur-md glow-soft sm:flex lg:-right-8">
        <Workflow className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">Agentic flow</span>
        <span className="ml-1 flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]" />
      </div>

      {/* Simulated mini chat preview */}
      <div className="animate-float-delayed absolute -top-[4.5rem] left-[16%] z-10 hidden w-52 rounded-2xl border border-primary/25 bg-card/70 p-4 backdrop-blur-xl glow-soft sm:block">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-primary/15 text-primary">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <span className="text-[11px] font-semibold">SFlyra</span>
          <span className="ml-auto flex items-center gap-1 text-[9px] text-highlight">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_currentColor]" />
            online
          </span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-tr-sm bg-primary/20 px-3 py-1.5 text-[11px] text-foreground">
            How can I automate my workflow?
          </div>
          <div className="flex items-end gap-1.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
              <Bot className="h-3 w-3" />
            </span>
            <div className="max-w-[85%] rounded-xl rounded-tl-sm border border-primary/20 bg-card/80 px-3 py-1.5 text-[11px] text-muted-foreground">
              Building your agent now…
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/20" />
        </div>
      </div>

      {burst ? <SparkleBurst /> : null}
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-[0.3em] text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

/* Services & Products data moved to src/lib/catalog.tsx */

const STATS = [
  { value: 5, suffix: "", label: "services" },
  { value: 1, suffix: "", label: "team" },
  { value: 4, suffix: "-step", label: "process" },
  { value: 0, suffix: "", label: "SFlyra — our own product" },
];

function StatCounter({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || value <= 0) return;
    const controls = animate(0, value, {
      duration: 1.4,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <span ref={ref} className="text-sm text-muted-foreground">
      {value > 0 ? (
        <>
          <span className="text-foreground">
            {display}
            {suffix}
          </span>{" "}
          {label}
        </>
      ) : (
        <span className="text-foreground">{label}</span>
      )}
    </span>
  );
}

function serviceSpan(i: number) {
  if (i === 0 || i === 3) return "lg:col-span-2";
  if (i === 4) return "lg:col-span-3";
  return "";
}

const PROCESS = [
  {
    n: "01",
    t: "Discover",
    d: "We map your goals, users and the friction hiding inside your process.",
  },
  { n: "02", t: "Design", d: "Interfaces and systems shaped around clarity, not decoration." },
  { n: "03", t: "Build", d: "Clean engineering with AI woven into the parts that deserve it." },
  { n: "04", t: "Launch", d: "Ship, measure, refine — and hand you something you can grow with." },
];

const FOUNDERS = [
  {
    name: "Fatimah Noman",
    photo: fatimahPhoto,
    bio: "Leads product and engineering at SFlyra Labs, turning ambitious ideas into shipped, intelligent software.",
    portfolio: "https://fatimah-ai.vercel.app/",
  },
  {
    name: "Summiya Ashraf",
    photo: sumiyaPhoto,
    bio: "Drives design and client strategy, making sure every build feels considered, premium and human.",
    portfolio: "https://summiyaashraf-portfolio.vercel.app/",
  },
];

const FAQ = [
  {
    q: "What is an AI Employee?",
    a: "An AI employee is an autonomous agent trained on your business. It answers customers, follows up on leads, drafts content and runs repetitive tasks around the clock — like a tireless team member that never sleeps.",
  },
  {
    q: "How long does custom integration take?",
    a: "Most custom builds ship in 1–3 weeks depending on scope. Our ready-made AI tools (chatbots, automation, auto-posters) deploy in as little as a few days.",
  },
  {
    q: "Can I hire a specific AI agent?",
    a: "Absolutely. We build bespoke agents tuned to the exact role and workflow you need — trained on your data and connected to the tools your team already uses every day.",
  },
  {
    q: "Do I need any technical knowledge?",
    a: "None at all. We handle setup, training and integration end-to-end, then hand you a simple dashboard so you can monitor and manage your AI workforce with ease.",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$490",
    priceNote: "project, from",
    desc: "One focused build for businesses taking their first step with AI.",
    features: [
      "1 ready-made AI tool",
      "Website or DM integration",
      "Training on your business",
      "30 days of support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "$1,490",
    priceNote: "project, from",
    desc: "A full automation setup that streamlines how leads and content move.",
    features: [
      "2–3 connected AI agents",
      "Custom workflows & integrations",
      "AI-assisted content system",
      "60 days of support + tuning",
    ],
    highlight: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    priceNote: "scoped to you",
    desc: "Bespoke agentic systems built for your exact workflows and data.",
    features: [
      "Dedicated AI employee/s",
      "CRM & tool integration",
      "Brand-tuned voice & processes",
      "Ongoing training & maintenance",
    ],
    highlight: false,
  },
];

const BLOG_POSTS = [
  {
    tag: "AI Agents",
    title: "What an AI employee actually does all day",
    excerpt:
      "A practical look at the tasks agents handle end-to-end — from first reply to closed deal — and where humans still win.",
  },
  {
    tag: "Automation",
    title: "From enquiry to follow-up: automating your pipeline",
    excerpt:
      "The playbook we use for triggered emails, WhatsApp sequences and reminders that keep every lead warm.",
  },
  {
    tag: "Product",
    title: "SFlyra: the story behind our ready-made agents",
    excerpt:
      "Why we built our own product line instead of just selling services — and what it means for your launch speed.",
  },
];

const contactInput =
  "w-full rounded-xl border border-border bg-card/60 text-sm text-foreground placeholder:text-muted-foreground/70 backdrop-blur-sm transition-all duration-200 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/15";

function Index() {
  const [burst, setBurst] = useState(true);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formError, setFormError] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setBurst(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setFormStatus("sending");
    setFormError("");
    try {
      const res = await fetch("https://formsubmit.co/ajax/sflyraai@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`FormSubmit responded with ${res.status}`);
      setFormStatus("sent");
      form.reset();
    } catch {
      setFormStatus("error");
      setFormError(
        "Something went wrong sending your message. Please try again, or email us directly at sflyraai@gmail.com.",
      );
    }
  };

  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden">
      <Sparkles />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-36 pb-20 lg:grid-cols-2 lg:px-8 lg:pt-44 lg:pb-28">
          <div className="animate-rise">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-highlight">
                <Sparkle className="h-3.5 w-3.5" /> Building Intelligence. Fusing Ideas.
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-600 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]" />
                </span>
                SFlyra Labs: Autonomous Systems Online
              </span>
            </div>
            <h1 className="mt-6 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              We build <span className="text-gradient">intelligence</span> into every process.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              SFlyra Labs is a digital agency for web development, AI automation and agentic
              workflows — crafting systems that think, act and scale alongside your team.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryButton href="#contact">Start a project</PrimaryButton>
              <GhostButton href="#product">Explore SFlyra</GhostButton>
            </div>
          </div>
          <div className="relative">
            <LogoPanel burst={burst} />
          </div>
        </section>

        {/* Company demo video — whole-website tour */}
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <DemoVideo />
        </section>

        {/* Stats strip */}
        <section className="border-y border-border/60 bg-card/30">
          <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-6 text-center lg:grid-cols-4 lg:px-8">
            {STATS.map((s, i) => (
              <motion.p
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="text-sm text-muted-foreground"
              >
                <StatCounter
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  delay={0.35 + i * 0.12}
                />
              </motion.p>
            ))}
          </Reveal>
        </section>

        {/* Services */}
        <section
          id="services"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32"
        >
          <Reveal>
            <SectionTitle
              eyebrow="What We Do"
              title="Custom work, built around how your business actually runs."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.08} className={serviceSpan(i)}>
                <SpotlightCard className="glass-panel h-full p-9 transition-all duration-300 hover:-translate-y-1 glow-soft hover:glow-strong sm:p-10">
                  <div className="absolute inset-0 bg-[image:var(--gradient-panel)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="absolute inset-0 z-0"
                    aria-label={`Open ${s.title}`}
                  />
                  <div className="pointer-events-none relative z-10">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                      <s.icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-7 font-display text-2xl font-semibold">{s.title}</h3>
                    <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-highlight"
                      >
                        Open page
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <ChatActionLink to="/services/$slug" params={{ slug: s.slug }} />
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Product — the SFlyra brand */}
        <section id="product" className="scroll-mt-24 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
            {/* Brand banner */}
            <Reveal>
              <div className="relative overflow-hidden rounded-[2.5rem] glass-panel px-6 py-14 text-center sm:px-14 sm:py-16">
                <div className="pointer-events-none absolute inset-x-0 -top-28 mx-auto h-64 w-64 rounded-full bg-primary/15 blur-[110px]" />
                <div className="relative flex flex-wrap items-center justify-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.25em] text-primary uppercase">
                    Our flagship product
                  </span>
                  <StatusPill />
                </div>
                <h2 className="relative mt-6 font-display text-6xl font-bold tracking-tight text-balance sm:text-8xl">
                  <span className="text-gradient">SFlyra</span>
                </h2>
                <p className="relative mt-5 font-display text-xl text-muted-foreground sm:text-2xl">
                  Intelligence, ready to use.
                </p>
                <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Pre-built AI tools you can deploy in days — chatbots, automation and agents that
                  work right out of the box.
                </p>
                <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
                  <PrimaryButton href="#contact">Get early access</PrimaryButton>
                </div>
              </div>
            </Reveal>

            {/* Product cards — 3 on top, 3 below (3-col grid) */}
            <Reveal>
              <div className="mt-16 mb-10 text-center">
                <p className="text-[11px] font-semibold tracking-[0.25em] text-primary uppercase">
                  The lineup
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Ready-to-deploy <span className="text-gradient">SFlyra products</span>
                </h3>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {PRODUCTS.map((p, i) => (
                <Reveal key={p.title} delay={(i % 3) * 0.06}>
                  <SpotlightCard className="glass-panel flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 glow-soft hover:glow-strong">
                    <div className="absolute inset-0 bg-[image:var(--gradient-panel)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug }}
                      className="absolute inset-0 z-0"
                      aria-label={`Open ${p.title}`}
                    />
                    <div className="pointer-events-none relative z-10 flex flex-1 flex-col gap-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                          <p.icon className="h-5 w-5" />
                        </span>
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-highlight">
                          {p.tag}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                      <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Link
                          to="/products/$slug"
                          params={{ slug: p.slug }}
                          className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-highlight"
                        >
                          View showcase
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <ChatActionLink to="/products/$slug" params={{ slug: p.slug }} />
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Work — temporarily hidden until real case studies exist
        <section id="work" className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <Reveal>
            <SectionTitle eyebrow="Work" title="Selected projects, arriving soon." />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {["Web platform", "AI automation", "Agentic system"].map((k, i) => (
              <Reveal key={k} delay={i * 0.1}>
                <article className="glass-panel flex aspect-4/3 flex-col justify-between rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 glow-soft hover:glow-strong">
                  <span className="text-xs tracking-[0.2em] text-primary uppercase">{k}</span>
                  <div>
                    <p className="font-display text-2xl font-semibold">Case study coming soon</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We're preparing the details of this build.
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        */}

        {/* Founders */}
        <section id="team" className="scroll-mt-24 border-y border-border/60 bg-card/20">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
            <Reveal>
              <SectionTitle eyebrow="Team" title="Two founders, one obsession with craft." />
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {FOUNDERS.map((f, i) => (
                <Reveal key={f.name} delay={i * 0.1} className="h-full">
                  <article className="group relative h-full overflow-hidden rounded-3xl glass-panel p-9 transition-all duration-300 hover:-translate-y-1 glow-soft hover:glow-strong sm:p-10">
                    <div className="absolute inset-0 bg-[image:var(--gradient-panel)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 rounded-[1.4rem] bg-[image:var(--gradient-primary)] opacity-25 blur-md transition-opacity duration-300 group-hover:opacity-45" />
                          <img
                            src={f.photo}
                            alt={f.name}
                            loading="lazy"
                            className="relative h-36 w-36 rounded-[1.4rem] object-cover shadow-lg ring-2 ring-primary/30 sm:h-40 sm:w-40"
                          />
                          <span className="absolute -right-2 -bottom-2 grid h-10 w-10 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-white shadow-md">
                            <Check className="h-5 w-5" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
                            Co-Founder, SFlyra Labs
                          </span>
                          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                            {f.name}
                          </h3>
                          <div className="mt-4 h-px w-12 bg-[image:var(--gradient-primary)]" />
                          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                            {f.bio}
                          </p>
                          {f.portfolio && (
                            <a
                              href={f.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10 hover:border-primary/40"
                            >
                              Portfolio
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <Reveal>
            <SectionTitle eyebrow="Process" title="A four-step path from idea to launch." />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <div className="group rounded-3xl border border-border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 glow-soft hover:glow-strong">
                  <span className="font-display text-4xl text-primary/40 transition-colors duration-300 group-hover:text-primary">
                    {p.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Insights — fresh thinking from the SFlyra team */}
        <section id="insights" className="scroll-mt-24 border-y border-border/60 bg-card/20">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <SectionTitle eyebrow="Insights" title="Notes from the lab." />
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Practical ideas on AI, automation and marketing — written by the people who ship
                  it every day.
                </p>
              </div>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {BLOG_POSTS.map((post, i) => (
                <Reveal key={post.title} delay={i * 0.1}>
                  <article className="glass-panel flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 glow-soft hover:glow-strong">
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-primary uppercase">
                      {post.tag}
                    </span>
                    <h3 className="mt-4 font-display text-xl leading-snug font-semibold">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-semibold text-primary">
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium text-highlight">
                        Coming soon
                      </span>
                    </span>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Statement */}
        <section className="border-y border-border/60">
          <Reveal>
            <div className="mx-auto max-w-4xl px-5 py-24 text-center lg:py-32">
              <p className="font-display text-2xl leading-snug italic sm:text-4xl">
                "AI should not replace your process — it should understand it, refine it, and
                quietly make it brilliant."
              </p>
            </div>
          </Reveal>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
            <Reveal>
              <SectionTitle eyebrow="Pricing" title="Honest pricing, no surprises." />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
                {PRICING.map((tier) => (
                  <div
                    key={tier.name}
                    className={`relative flex h-full flex-col rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 ${
                      tier.highlight
                        ? "border border-primary/50 bg-[image:var(--gradient-panel)] shadow-xl shadow-primary/10 glow-soft"
                        : "glass-panel glow-soft hover:glow-strong"
                    }`}
                  >
                    {tier.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[image:var(--gradient-primary)] px-3.5 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                        Most popular
                      </span>
                    )}
                    <p className="text-[11px] font-semibold tracking-[0.25em] text-primary uppercase">
                      {tier.name}
                    </p>
                    <p className="mt-4 font-display text-4xl font-bold tracking-tight">
                      {tier.price}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{tier.priceNote}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {tier.desc}
                    </p>
                    <ul className="mt-6 flex flex-1 flex-col gap-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className={`group relative mt-8 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                        tier.highlight
                          ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                          : "border border-primary/40 text-foreground hover:bg-primary/10"
                      }`}
                    >
                      Get a quote
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32"
        >
          <Reveal>
            <div className="mx-auto flex flex-col items-center text-center">
              <SectionTitle eyebrow="Contact" title="Let's build something intelligent." />
              <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
                Tell us about your project and we'll come back with a plan, a timeline and an honest
                opinion.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-12">
              {/* ── Form ── */}
              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-10">
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/15 blur-[100px]" />

                {formStatus === "sent" ? (
                  <div className="flex min-h-[28rem] flex-col items-center justify-center text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 className="h-8 w-8" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold">Message sent!</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      Thanks for reaching out — we'll get back to you within 24 hours with a plan, a
                      timeline and an honest estimate.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus("idle")}
                      className="mt-7 rounded-full border border-border px-5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    action="https://formsubmit.co/sflyraai@gmail.com"
                    method="POST"
                    className="relative space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="cf-name"
                          className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                        >
                          Name
                        </label>
                        <div className="relative">
                          <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                          <input
                            id="cf-name"
                            name="name"
                            type="text"
                            required
                            placeholder="What should we call you?"
                            className={`${contactInput} py-3 pl-11 pr-4`}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="cf-email"
                          className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                          <input
                            id="cf-email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@company.com"
                            className={`${contactInput} py-3 pl-11 pr-4`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="cf-message"
                        className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                      >
                        Project details
                      </label>
                      <div className="relative">
                        <MessageCircle className="pointer-events-none absolute top-4 left-4 h-4 w-4 text-muted-foreground/60" />
                        <textarea
                          id="cf-message"
                          name="message"
                          rows={5}
                          required
                          placeholder="Tell us about your project — what are you building, and what problems should AI solve?"
                          className={`${contactInput} resize-none py-3.5 pl-11 pr-4`}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="group relative mt-2 inline-flex items-center gap-2 overflow-hidden rounded-full bg-[image:var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 animate-cta-pulse disabled:pointer-events-none disabled:opacity-70"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_120%,rgba(255,255,255,0.35),transparent_55%)]"
                      />
                      <span className="relative shrink-0">
                        {formStatus === "sending" ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                            Sending...
                          </span>
                        ) : (
                          "Send message"
                        )}
                      </span>
                      <Send
                        aria-hidden
                        className="relative -ml-2 h-4 w-0 shrink-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:ml-1 group-hover:w-4 group-hover:opacity-100"
                      />
                    </button>
                    {formStatus === "error" && (
                      <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
                        {formError}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* ── Direct contact details ── */}
              <div className="flex flex-col gap-5">
                {/* Email */}
                <a
                  href="mailto:sflyraai@gmail.com"
                  className="group glass-panel flex items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium">sflyraai@gmail.com</p>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/sflyra_labs/"
                  target="_blank"
                  rel="noreferrer"
                  className="group glass-panel flex items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Instagram className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Instagram
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium">@sflyra_labs</p>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61594396690562"
                  target="_blank"
                  rel="noreferrer"
                  className="group glass-panel flex items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Facebook className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Facebook
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium">SFlyra Labs</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappHref("Hi SFlyra Labs! I'd like to discuss a project.")}
                  target="_blank"
                  rel="noreferrer"
                  className="group glass-panel flex items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white sm:text-emerald-500 dark:text-emerald-300">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      WhatsApp
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium">Chat instantly</p>
                  </div>
                </a>

                {/* Response time */}
                <div className="glass-panel rounded-3xl p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Response time
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold">Under 24 hours</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Every enquiry gets a personal reply — a clear plan, a realistic timeline, and an
                    honest opinion.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 lg:px-8 lg:py-32">
          <Reveal>
            <div className="text-center">
              <SectionTitle eyebrow="FAQ" title="Your questions, answered." />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="mt-12 space-y-4">
              {FAQ.map((f) => (
                <AccordionItem
                  key={f.q}
                  value={f.q}
                  className="glass-panel overflow-hidden rounded-2xl px-6 py-1 border-primary/10"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold hover:no-underline [&[data-state=open]]:text-primary">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-8 leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>
      </main>

      <SiteFooter />

      {/* Floating home-page chat launcher */}
      <FloatingChatWidget />
    </div>
  );
}
