import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Rocket, Settings2 } from "lucide-react";

import {
  ChatActionLink,
  GhostButton,
  PageBar,
  PrimaryButton,
  Reveal,
  SectionTitle,
  SiteFooter,
  SpotlightCard,
} from "@/components/site/site-ui";
import { AgentChatPanel } from "@/components/site/agent-chat";
import { PRODUCTS, findProduct } from "@/lib/catalog";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const product = findProduct(params.slug);
    return {
      meta: [
        {
          title: product
            ? `${product.title} — SFlyra products | SFlyra Labs`
            : "SFlyra products — SFlyra Labs",
        },
        {
          name: "description",
          content: product
            ? `${product.title} by SFlyra Labs. ${product.long}`
            : "Showcase pages for SFlyra — ready-to-deploy AI tools and custom agents built by SFlyra Labs.",
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PageBar />
        <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <p className="text-7xl font-bold text-foreground">404</p>
          <h1 className="mt-4 text-xl font-semibold">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            That product doesn't exist — browse the SFlyra lineup instead.
          </p>
          <div className="mt-6">
            <PrimaryButton href="/#product">Back to SFlyra</PrimaryButton>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const Icon = product.icon;
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageBar />

      <main>
        {/* Showcase hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-32 pb-20 lg:grid-cols-2 lg:px-8 lg:pt-40 lg:pb-28">
          <Reveal>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-highlight">
                  <Icon className="h-3.5 w-3.5" /> SFlyra product
                </span>
                <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-highlight">
                  {product.tag}
                </span>
              </div>
              <h1 className="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
                {product.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {product.long}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <PrimaryButton href="/#contact">{product.cta}</PrimaryButton>
                <GhostButton href="/#product">Back to SFlyra</GhostButton>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  {product.deployment === "ready" ? (
                    <Rocket className="h-4 w-4 text-primary" />
                  ) : (
                    <Settings2 className="h-4 w-4 text-primary" />
                  )}
                  {product.deployment === "ready"
                    ? "Ready to deploy in days"
                    : "Custom-built for your business"}
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Trained on your data
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Human oversight built in
                </span>
              </div>
            </div>
          </Reveal>

          {/* Live chat with this product's agent */}
          <Reveal delay={0.1}>
            <div id="agent-chat" className="scroll-mt-24">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_currentColor]" />
                Live agent chat
              </p>
              <AgentChatPanel agentId={product.slug} agentName={product.title} />
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Chatting with the real{" "}
                  <span className="font-semibold text-foreground">{product.title}</span> agent — ask
                  about setup, workflows, or pricing.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* What it does */}
        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-28">
            <Reveal>
              <SectionTitle
                eyebrow="Powered by SFlyra Labs"
                title={`What ${product.title} does for you.`}
              />
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {product.features.map((f, i) => (
                <Reveal key={f} delay={(i % 2) * 0.08}>
                  <div className="glass-panel flex items-start gap-4 rounded-2xl p-5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold">{f}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Managed end-to-end by the SFlyra Labs team.
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Related products */}
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-28">
          <Reveal>
            <SectionTitle eyebrow="More SFlyra" title="Keep exploring the lineup." />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => {
              const RI = r.icon;
              return (
                <Reveal key={r.slug} delay={(i % 3) * 0.07}>
                  <SpotlightCard className="glass-panel flex h-full flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-1 glow-soft hover:glow-strong">
                    <Link
                      to="/products/$slug"
                      params={{ slug: r.slug }}
                      className="absolute inset-0 z-0"
                      aria-label={`Open ${r.title}`}
                    />
                    <div className="pointer-events-none relative z-10 flex flex-1 flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                          <RI className="h-5 w-5" />
                        </span>
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-highlight">
                          {r.tag}
                        </span>
                      </div>
                      <div className="mt-auto">
                        <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {r.desc}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <Link
                            to="/products/$slug"
                            params={{ slug: r.slug }}
                            className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-highlight"
                          >
                            View showcase <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                          <ChatActionLink to="/products/$slug" params={{ slug: r.slug }} />
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8 lg:pb-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] glass-panel px-7 py-14 text-center sm:px-14">
              <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-56 w-56 rounded-full bg-primary/20 blur-[100px]" />
              <h2 className="relative font-display text-3xl leading-tight font-semibold sm:text-4xl">
                Deploy {product.title} this week.
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
                Pick an agent, tell us where it should live, and we'll have it trained and running
                in days.
              </p>
              <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
                <PrimaryButton href="/#contact">{product.cta}</PrimaryButton>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
