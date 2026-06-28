/* DESIGN: Dusk Restoration. Results read like a personalized report: gauge,
   honest message, custom protocol cards, products (T2/T3), dual CTAs. */
import { Download, RotateCcw, Sparkles, FlaskConical } from "lucide-react";
import DepletionGauge from "./DepletionGauge";
import {
  MAX_SCORE,
  PRODUCTS,
  getTier,
  pickTools,
  type StateTag,
} from "@/lib/quizData";

interface Props {
  firstName: string;
  score: number;
  tagCounts: Record<StateTag, number>;
  onRestart: () => void;
  onCta: (kind: "guide" | "products") => void;
}

const LEAF = "/manus-storage/leaf-accent_b5be5ad8.png";

export default function QuizResult({
  firstName,
  score,
  tagCounts,
  onRestart,
  onCta,
}: Props) {
  const tier = getTier(score);
  const tools = pickTools(tagCounts, tier.id === 1 ? 4 : tier.id === 2 ? 3 : 3);

  return (
    <div className="relative min-h-screen w-full pb-24">
      {/* soft top band */}
      <div className="container max-w-3xl pt-12">
        {/* Header card */}
        <div className="anim-rise overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-ink/10">
          <div className="bg-gradient-to-b from-clay/8 to-transparent px-6 pt-9 pb-7 text-center sm:px-12">
            <span className="text-sm font-600 uppercase tracking-[0.18em] text-clay-deep">
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
            <h1 className="mx-auto mt-5 max-w-md font-display text-2xl font-600 leading-tight text-ink">
              {tier.name}
            </h1>
          </div>
        </div>

        {/* The message */}
        <section
          className="anim-rise mt-7"
          style={{ animationDelay: "90ms" }}
        >
          <h2 className="font-display text-2xl font-600 leading-snug text-ink sm:text-[1.85rem]">
            {tier.headline}
          </h2>
          <p className="mt-3 font-display text-lg italic text-clay-deep">
            {tier.intro}
          </p>
          <div className="mt-4 space-y-4 text-[1.05rem] leading-relaxed text-ink/85">
            {tier.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Ritual tools */}
        <section
          className="anim-rise mt-10"
          style={{ animationDelay: "160ms" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sage-deep" />
            <h3 className="font-display text-xl font-600 text-ink">
              {tier.toolsLead}
            </h3>
          </div>
          <div className="grid gap-3.5">
            {tools.map((t, i) => (
              <div
                key={t.key}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm shadow-ink/5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 font-display text-sm font-600 text-sage-deep">
                  {i + 1}
                </span>
                <div>
                  <p className="font-600 text-ink">{t.name}</p>
                  <p className="mt-1 text-[0.97rem] leading-relaxed text-ink/75">
                    {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products (Tier 2 & 3) */}
        {tier.showProducts && (
          <section
            className="anim-rise mt-11 rounded-[2rem] border border-clay/20 bg-clay/[0.05] p-6 sm:p-8"
            style={{ animationDelay: "230ms" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-clay-deep" />
              <h3 className="font-display text-xl font-600 text-ink">
                {tier.productsLead}
              </h3>
            </div>
            <p className="mb-6 max-w-xl font-display text-base italic text-ink/75">
              Your body knows how to regulate itself — it just needs the raw
              materials to do it.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {PRODUCTS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm shadow-ink/5"
                >
                  <span className="text-xs font-600 uppercase tracking-[0.12em] text-sage-deep">
                    {p.tagline}
                  </span>
                  <p className="mt-1.5 font-display text-lg font-600 leading-tight text-ink">
                    {p.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTAs */}
        <section
          className="anim-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animationDelay: "300ms" }}
        >
          <button
            onClick={() => onCta(tier.primaryCta.kind)}
            className="press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-clay px-7 py-4 text-base font-600 text-primary-foreground shadow-lg shadow-clay/25 hover:bg-clay-deep"
          >
            {tier.primaryCta.kind === "guide" && <Download className="h-5 w-5" />}
            {tier.primaryCta.label}
          </button>
          {tier.secondaryCta && (
            <button
              onClick={() => onCta(tier.secondaryCta!.kind)}
              className="press inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-clay/40 bg-transparent px-7 py-4 text-base font-600 text-clay-deep hover:bg-clay/8"
            >
              {tier.secondaryCta.kind === "guide" && (
                <Download className="h-5 w-5" />
              )}
              {tier.secondaryCta.label}
            </button>
          )}
        </section>

        {/* footer */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 text-center">
          <img src={LEAF} alt="" className="h-10 w-10 opacity-70" />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            This quiz is for educational reflection and isn't medical advice. If
            you're concerned about your health, talk with a clinician you trust.
          </p>
          <button
            onClick={onRestart}
            className="press mt-1 inline-flex items-center gap-2 text-sm font-600 text-ink/70 hover:text-clay-deep"
          >
            <RotateCcw className="h-4 w-4" /> Retake the quiz
          </button>
        </div>
      </div>
    </div>
  );
}
