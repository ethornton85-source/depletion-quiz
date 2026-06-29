/* DESIGN: Dusk Restoration — warm editorial. Asymmetric left-weighted hero,
   organic hero art on the right, clay CTA, Fraunces display voice. */
import { ArrowRight, Clock, Leaf } from "lucide-react";

const HERO = "/manus-storage/hero_12f8dbda.png";
const LOGO = "/manus-storage/logo_4fe66f5a.png";

export default function QuizIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="container flex items-center gap-2.5 pt-7">
        <img src={LOGO} alt="" className="h-9 w-9" />
        <span className="font-display text-xl font-600 tracking-tight text-ink">
          Erin Iannarelli
        </span>
      </header>

      <div className="container grid items-center gap-10 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pt-16">
        {/* Left: copy */}
        <div className="anim-rise max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-clay/30 bg-clay/8 px-4 py-1.5 text-xs font-600 uppercase tracking-[0.16em] text-clay-deep">
            <Leaf className="h-3.5 w-3.5" /> A 2-minute honest check-in
          </span>

          <h1 className="mt-6 font-display text-[2.7rem] font-600 leading-[1.04] text-ink sm:text-6xl">
            How depleted
            <br /> are you{" "}
            <span className="relative whitespace-nowrap text-clay">
              really?
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 9C40 3 120 2 198 7"
                  stroke="var(--sage)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/80">
            Find out what your body{" "}
            <span className="font-display italic">actually</span> needs — not
            another tip to breathe more. Answer 10 quick questions and get a
            personalized read on your nervous system, plus the exact tools to
            start feeling like yourself again.
          </p>

          <button
            onClick={onStart}
            className="press mt-9 inline-flex items-center gap-2 rounded-full bg-clay px-8 py-4 text-base font-600 text-primary-foreground shadow-lg shadow-clay/25 hover:bg-clay-deep"
          >
            Start the quiz
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Takes ~2 minutes
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>10 questions</span>
          </div>
        </div>

        {/* Right: hero art */}
        <div className="anim-fade relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/10 ring-1 ring-ink/5">
            <img
              src={HERO}
              alt="A calm, warm dusk landscape evoking rest and restoration"
              className="h-full w-full object-cover"
            />
          </div>
          {/* floating quote chip */}
          <div className="absolute -bottom-5 left-4 max-w-[16rem] rounded-2xl bg-card/95 p-4 shadow-xl ring-1 ring-ink/5 backdrop-blur sm:left-8">
            <p className="font-display text-[0.95rem] italic leading-snug text-ink/90">
              “A breathing exercise isn't going to fix this — but knowing what's
              really going on can.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
