/* DESIGN: Dusk Restoration. Focused single-column question, slim organic
   progress, options gently lift/warm on hover, soft cross-fade between Qs. */
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import type { Question, Option } from "@/lib/quizData";

interface Props {
  question: Question;
  index: number;
  total: number;
  selectedLabel?: string;
  onSelect: (option: Option) => void;
  onBack: () => void;
  canBack: boolean;
}

export default function QuizQuestion({
  question,
  index,
  total,
  selectedLabel,
  onSelect,
  onBack,
  canBack,
}: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const pct = Math.round(((index + 1) / total) * 100);

  // reset transient selection visual when question changes
  useEffect(() => {
    setPending(null);
  }, [question.id]);

  function handle(opt: Option) {
    setPending(opt.label);
    // brief beat so the user sees the selection confirm, then advance
    setTimeout(() => onSelect(opt), 240);
  }

  return (
    <div className="container flex min-h-screen max-w-2xl flex-col py-8">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          disabled={!canBack}
          className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink/70 transition hover:text-ink disabled:opacity-0"
          aria-label="Previous question"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-xs font-600 uppercase tracking-[0.14em] text-muted-foreground">
            <span>
              Question {index + 1} of {total}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage to-clay"
              style={{
                width: `${pct}%`,
                transition: "width 0.6s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div key={question.id} className="anim-rise mt-12 flex flex-1 flex-col">
        <h2 className="font-display text-[1.9rem] font-600 leading-tight text-ink sm:text-4xl">
          {question.prompt}
        </h2>
        {question.helper && (
          <p className="mt-3 font-display text-base italic text-muted-foreground">
            {question.helper}
          </p>
        )}

        <div className="mt-9 flex flex-col gap-3.5">
          {question.options.map((opt) => {
            const active = pending === opt.label || (!pending && selectedLabel === opt.label);
            return (
              <button
                key={opt.label}
                onClick={() => handle(opt)}
                className={`press group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-[1.02rem] leading-snug transition ${
                  active
                    ? "border-clay bg-clay/10 text-ink shadow-md shadow-clay/15"
                    : "border-border bg-card text-ink/90 hover:-translate-y-0.5 hover:border-clay/40 hover:bg-clay/[0.04] hover:shadow-md hover:shadow-ink/5"
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    active
                      ? "border-clay bg-clay text-primary-foreground"
                      : "border-border text-transparent group-hover:border-clay/50"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
