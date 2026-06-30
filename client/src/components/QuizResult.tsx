/* Results page: personalized by tier, nervous system tag, product openness, and flavor. */
import { Download, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import DepletionGauge from "./DepletionGauge";
import {
  MAX_SCORE,
  getTier,
  pickTools,
  getCartLink,
  type StateTag,
  type Flavor,
  type ProductOpenness,
} from "@/lib/quizData";

interface Props {
  firstName: string;
  score: number;
  tagCounts: Record<StateTag, number>;
  flavor: Flavor;
  productOpen: ProductOpenness;
  onRestart: () => void;
}

const FLAVOR_LABELS: Record<Flavor, string> = {
  grape: "Grape",
  "lemon-lime": "Lemon Lime",
  "black-cherry": "Black Cherry",
  any: "your favorite flavor",
};

export default function QuizResult({ firstName, score, tagCounts, flavor, productOpen, onRestart }: Props) {
  const tier = getTier(score);
  const tools = pickTools(tagCounts, tier.id === 1 ? 4 : 3);
  const showProducts = productOpen !== "no" && (tier.showNitro || tier.showBody);
  const { nitroUrl, bodyUrl, bundleUrl } = getCartLink(tier.id, flavor);
  const flavorLabel = FLAVOR_LABELS[flavor];

  return (
    <div className="relative min-h-screen w-full pb-24">
      <div className="container max-w-3xl pt-12">

        {/* Header card */}
        <div className="anim-rise overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-ink/10">
          <div className="bg-gradient-to-b from-lavender/10 to-transparent px-6 pt-9 pb-7 text-center sm:px-12">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-lavender-deep">
              {firstName ? `${firstName}, here's your read` : "Your read"}
            </span>
            <div className="mt-6">
              <DepletionGauge
                score={score}
                max={MAX_SCORE}
                label={tier.gaugeLabel}
                tierName={tier.name}
              />
            </div>
            <h1 className="mx-auto mt-5 max-w-md font-display text-2xl font-semibold leading-tight text-ink">
              {tier.name}
            </h1>
          </div>
        </div>

        {/* The message */}
        <section className="anim-rise mt-7" style={{ animationDelay: "90ms" }}>
          <h2 className="font-display text-2xl font-semibold leading-snug text-ink sm:text-[1.85rem]">
            {tier.headline}
          </h2>
          <p className="mt-3 font-display text-lg italic text-lavender-deep">
            {tier.intro}
          </p>
          <div className="mt-4 space-y-4 text-[1.05rem] leading-relaxed text-ink/85">
            {tier.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Ritual tools */}
        <section className="anim-rise mt-10" style={{ animationDelay: "160ms" }}>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sage-deep" />
            <h3 className="font-display text-xl font-semibold text-ink">
              {tier.toolsLead}
            </h3>
          </div>
          <div className="grid gap-3.5">
            {tools.map((t, i) => (
              <div
                key={t.key}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm shadow-ink/5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lavender/15 font-display text-sm font-semibold text-lavender-deep">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="mt-1 text-[0.97rem] leading-relaxed text-ink/75">
                    {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        {showProducts && (
          <section
            className="anim-rise mt-11 rounded-[2rem] border border-lavender/20 bg-lavender/[0.05] p-6 sm:p-8"
            style={{ animationDelay: "230ms" }}
          >
            <h3 className="font-display text-xl font-semibold text-ink mb-1">
              {tier.productsLead}
            </h3>
            <p className="mb-3 max-w-xl text-[1rem] leading-relaxed text-ink/80">
              Depending on where you're at, you might be able to start with just the Nueva Nitro — the hydrogen water — and the reset protocol, and feel a real difference. That said, I personally felt the biggest shift when I used both together, and I recommend the bundle for anyone who's serious about rebuilding. Click each product name for the full info, then decide what feels right for you.
            </p>
            <p className="mb-5 max-w-xl text-sm text-ink/50 italic">
              This is not medical advice. Please share this information with your doctor and make the decision that's best for your health.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Nueva Nitro */}
              {tier.showNitro && (
                <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm shadow-ink/5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sage-deep">
                    Gentle energy without the crash
                  </span>
                  <a
                    href="/nueva-nitro-info.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 font-display text-lg font-semibold leading-tight text-lavender-deep hover:underline"
                  >
                    Nueva Nitro {flavor !== "any" ? `— ${flavorLabel}` : ""}
                  </a>
                  <p className="mt-1 text-xs font-medium text-ink/50 italic">Click name for full product info ↗</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    Molecular hydrogen + L-Citrulline + natural green tea caffeine. Supports cellular energy, circulation, and focus — without overstimulation or a crash.
                  </p>
                  <a
                    href={nitroUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-lavender px-4 py-2 text-sm font-semibold text-lavender-deep hover:bg-lavender/10"
                  >
                    Get Nueva Nitro <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* Nueva Body */}
              {tier.showBody && (
                <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm shadow-ink/5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sage-deep">
                    Cellular restoration
                  </span>
                  <a
                    href="/nueva-body-info.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 font-display text-lg font-semibold leading-tight text-lavender-deep hover:underline"
                  >
                    Nueva Body
                  </a>
                  <p className="mt-1 text-xs font-medium text-ink/50 italic">Click name for full product info ↗</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    5-Amino-1MQ + SLU-PP-332 — supports mitochondrial biogenesis and NAD+ metabolism. Helps rebuild your body's capacity to produce real energy. Stimulant-free. 3rd party lab tested.
                  </p>
                  <a
                    href={bodyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-lavender px-4 py-2 text-sm font-semibold text-lavender-deep hover:bg-lavender/10"
                  >
                    Get Nueva Body <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Bundle CTA for Tier 3 */}
            {tier.showNitro && tier.showBody && (
              <div className="mt-5">
                <a
                  href={bundleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-lavender px-7 py-4 text-lg font-bold text-white shadow-lg shadow-lavender/30 hover:bg-lavender-deep"
                >
                  Get the Full Bundle — Nitro + Body
                  <ExternalLink className="h-5 w-5" />
                </a>
                <p className="mt-2 text-center text-xs text-ink/50">
                  *These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease. Not medical advice — consult your doctor before use.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Guide CTA */}
        <section className="anim-rise mt-10 flex flex-col gap-3" style={{ animationDelay: "300ms" }}>
          <p className="text-center text-sm text-ink/60">
            Calm your nervous system on the drive home — free strategies for a smoother work-to-home transition.
          </p>
          <a
            href="/reset-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-lavender px-7 py-4 text-base font-semibold text-white shadow-lg shadow-lavender/25 hover:bg-lavender-deep"
          >
            <Download className="h-5 w-5" />
            Download the Post-Shift Reset Guide
          </a>
        </section>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 text-center">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            This quiz is for educational reflection and isn't medical advice. If you're concerned about your health, talk with a clinician you trust.
          </p>
          <button
            onClick={onRestart}
            className="press mt-1 inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-lavender-deep"
          >
            <RotateCcw className="h-4 w-4" /> Retake the quiz
          </button>
        </div>
      </div>
    </div>
  );
}
