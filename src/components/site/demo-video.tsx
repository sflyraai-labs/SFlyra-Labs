import { AudioLines, Play } from "lucide-react";

import { Reveal } from "@/components/site/site-ui";
import { cn } from "@/lib/utils";

/**
 * ── SFlyra Product Demo Video ──────────────────────────────────────────────
 * Responsive 16:9 YouTube embed shown inside the flagship SFlyra product
 * section. Dark cyber/AI styling matching the site tokens.
 *
 * Swap the ID in DEMO_VIDEO_URL (or pass your own `videoUrl` prop) once the
 * real walkthrough video is uploaded. Recommended YouTube params:
 *
 *   https://www.youtube.com/embed/<ID>?rel=0&modestbranding=1&color=white
 */
export const DEMO_VIDEO_URL =
  "https://www.youtube.com/embed/puTFDIM4Mug?rel=0&modestbranding=1&color=white";

type DemoVideoProps = {
  /** Full YouTube embed URL (see DEMO_VIDEO_URL above). */
  videoUrl?: string;
  /** Badge label in the header. */
  badgeLabel?: string;
  /** Heading text. */
  heading?: string;
  /** Part of the heading to highlight with the brand gradient. */
  highlight?: string;
  /** Support text under the heading. */
  subtext?: string;
  /** Extra classes (e.g. vertical spacing) merged onto the block. */
  className?: string;
};

export function DemoVideo({
  videoUrl = DEMO_VIDEO_URL,
  badgeLabel = "SFlyra Walkthrough",
  heading = "See SFlyra in Action",
  highlight = "SFlyra",
  subtext = "Watch how our autonomous workflows and custom AI tools integrate into your operations.",
  className,
}: DemoVideoProps) {
  const [before, after] = heading.split(highlight);
  return (
    <Reveal className={cn("relative mx-auto mt-16 max-w-5xl", className)}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="relative text-center">
        {/* Ambience glow behind the header */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[90px]"
        />

        <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-300 uppercase shadow-[0_0_24px_-6px_rgba(16,185,129,0.55)]">
          <Play aria-hidden className="h-3.5 w-3.5 fill-current" />
          {badgeLabel}
        </span>

        <h2 className="relative mt-6 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          {after === undefined ? (
            heading
          ) : (
            <>
              {before}
              <span className="text-gradient">{highlight}</span>
              {after}
            </>
          )}
        </h2>

        <p className="relative mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subtext}
        </p>
      </div>

      {/* ── Video frame ────────────────────────────────────────── */}
      <div className="group relative">
        {/* Ambient halo that brightens on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(55%_55%_at_50%_18%,rgba(16,185,129,0.18),transparent_72%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-primary/15 bg-card/50 p-1.5 shadow-lg shadow-black/40 backdrop-blur-sm",
            "transition-all duration-500",
            "group-hover:border-emerald-400/40 group-hover:shadow-[0_24px_70px_-18px_rgba(16,185,129,0.4)]",
          )}
        >
          {/* Cyber gradient ring (mask-border technique from SpotlightCard) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              padding: 1,
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(56,189,248,0.55) 45%, transparent 80%)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
            }}
          />

          {/* 16:9 embed */}
          <div className="relative overflow-hidden rounded-xl bg-black/70">
            <iframe
              src={videoUrl}
              title={badgeLabel}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="block aspect-video w-full border-0"
            />

            {/* Live indicator overlay (non-interactive) */}
            <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-black/60 px-2.5 py-1 text-[9px] font-bold tracking-widest text-emerald-300 uppercase backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_currentColor]" />
              </span>
              Live walkthrough
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer badge tag ──────────────────────────────────── */}
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 px-3.5 py-1.5 backdrop-blur-sm">
          <AudioLines aria-hidden className="h-3.5 w-3.5 text-primary" />
          Narration powered by <span className="font-semibold text-foreground">ElevenLabs AI</span>
        </span>
      </p>
    </Reveal>
  );
}
