/* Single-page quiz state machine: intro -> questions -> email gate -> result. */
import { useState } from "react";
import QuizIntro from "@/components/QuizIntro";
import QuizQuestion from "@/components/QuizQuestion";
import EmailGate from "@/components/EmailGate";
import QuizResult from "@/components/QuizResult";
import { QUESTIONS, type Option, type StateTag, type Flavor, type ProductOpenness } from "@/lib/quizData";

type Stage = "intro" | "quiz" | "gate" | "result";

interface Answer {
  points: number;
  label: string;
  tag?: StateTag;
  flavor?: Flavor;
  productOpen?: ProductOpenness;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [firstName, setFirstName] = useState("");

  function selectOption(opt: Option) {
    const q = QUESTIONS[current];
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { points: opt.points, label: opt.label, tag: opt.tag, flavor: opt.flavor, productOpen: opt.productOpen },
    }));
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setStage("gate");
    }
  }

  function back() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  function restart() {
    setAnswers({});
    setCurrent(0);
    setFirstName("");
    setStage("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Score is only from questions 1-7 (the depletion questions)
  const score = Object.entries(answers)
    .filter(([id]) => Number(id) <= 7)
    .reduce((s, [, a]) => s + a.points, 0);

  const tagCounts: Record<StateTag, number> = { wired: 0, flat: 0, drained: 0 };
  Object.values(answers).forEach((a) => {
    if (a.tag) tagCounts[a.tag] += 1;
  });

  const flavor: Flavor = (Object.values(answers).find((a) => a.flavor)?.flavor) ?? "any";
  const productOpen: ProductOpenness = (Object.values(answers).find((a) => a.productOpen)?.productOpen) ?? "maybe";

  async function handleGate(data: { firstName: string; email: string; phone: string; country: string }) {
    setFirstName(data.firstName);

    // Determine dominant tag
    const tagOrder: StateTag[] = ["wired", "drained", "flat"];
    const dominantTag = tagOrder.reduce((best, t) =>
      tagCounts[t] > tagCounts[best] ? t : best, tagOrder[0]);

    // Fire-and-forget — we don't block the UI on this
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        score,
        tier: score <= 5 ? 1 : score <= 10 ? 2 : 3,
        tierName: score <= 5 ? "Situationally Depleted" : score <= 10 ? "Chronically Running on Empty" : "Hitting a Wall",
        dominantTag,
        openToProducts: productOpen,
        flavorChoice: flavor,
      }),
    }).catch(() => {/* silently ignore — don't block the user */});

    setStage("result");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  return (
    <div className="grain min-h-screen w-full bg-background">
      {stage === "intro" && <QuizIntro onStart={() => setStage("quiz")} />}

      {stage === "quiz" && (
        <QuizQuestion
          question={QUESTIONS[current]}
          index={current}
          total={QUESTIONS.length}
          selectedLabel={answers[QUESTIONS[current].id]?.label}
          onSelect={selectOption}
          onBack={back}
          canBack={current > 0}
        />
      )}

      {stage === "gate" && <EmailGate onSubmit={handleGate} />}

      {stage === "result" && (
        <div className="container flex min-h-screen max-w-md flex-col items-center justify-center py-12">
          <div className="anim-rise w-full rounded-[2rem] border border-border bg-card p-8 shadow-2xl shadow-ink/10 text-center sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-lavender/15 text-3xl">
              💌
            </div>
            <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
              {firstName ? `${firstName}, your results are on their way!` : "Your results are on their way!"}
            </h2>
            <p className="mt-3 text-ink/70 leading-relaxed">
              Check your email — I've sent you your personalized depletion results, your nervous system reset protocol, and everything you need to start feeling better tonight.
            </p>
            <p className="mt-3 text-sm text-ink/50">
              Don't see it? Check your spam or promotions folder and move it to your inbox so you don't miss what's coming next.
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed">
              And keep an eye out tomorrow — I'm sharing something personal about why I believe this matters so much, and why now is the right time to take it seriously.
            </p>
            <p className="mt-6 font-display text-base italic text-lavender-deep">
              — Erin
            </p>
            <button
              onClick={restart}
              className="press mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink/50 hover:text-lavender-deep"
            >
              ↩ Retake the quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
