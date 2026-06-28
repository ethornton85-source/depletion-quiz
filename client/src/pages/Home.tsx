/* DESIGN: Dusk Restoration — warm editorial apothecary.
   Single-page quiz state machine: intro -> questions -> email gate -> result. */
import { useState } from "react";
import { toast } from "sonner";
import QuizIntro from "@/components/QuizIntro";
import QuizQuestion from "@/components/QuizQuestion";
import EmailGate from "@/components/EmailGate";
import QuizResult from "@/components/QuizResult";
import { QUESTIONS, type Option, type StateTag } from "@/lib/quizData";

type Stage = "intro" | "quiz" | "gate" | "result";

interface Answer {
  points: number;
  label: string;
  tag?: StateTag;
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
      [q.id]: { points: opt.points, label: opt.label, tag: opt.tag },
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

  const score = Object.values(answers).reduce((s, a) => s + a.points, 0);
  const tagCounts: Record<StateTag, number> = { wired: 0, flat: 0, drained: 0 };
  Object.values(answers).forEach((a) => {
    if (a.tag) tagCounts[a.tag] += 1;
  });

  function handleGate(data: { firstName: string; email: string }) {
    setFirstName(data.firstName);
    // In production: POST to your ESP/CRM here.
    setStage("result");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  function handleCta(kind: "guide" | "products") {
    if (kind === "guide") {
      toast.success("Your Reset Guide is on its way", {
        description: `We've sent the full guide to your inbox${
          firstName ? `, ${firstName}` : ""
        }. Check your email in a moment.`,
      });
    } else {
      toast("Connect your store here", {
        description:
          "Link this button to your product/shop page when you embed the quiz.",
      });
    }
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
        <QuizResult
          firstName={firstName}
          score={score}
          tagCounts={tagCounts}
          onRestart={restart}
          onCta={handleCta}
        />
      )}
    </div>
  );
}
