import { useEffect, useState } from "react";

// Animated arc gauge that fills to the depletion ratio in brand colors.
interface Props {
  score: number;
  max: number;
  label: string;
  tierName: string;
}

export default function DepletionGauge({ score, max, label, tierName }: Props) {
  const ratio = Math.min(1, score / max);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(ratio), 350);
    return () => clearTimeout(t);
  }, [ratio]);

  // Semi-circle arc geometry
  const size = 240;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * r; // half circle
  const dash = circumference;
  const offset = circumference * (1 - progress);

  // Color shifts sage -> ochre -> clay as depletion rises
  const arcColor =
    ratio <= 0.38 ? "var(--sage)" : ratio <= 0.72 ? "var(--ochre)" : "var(--clay)";

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={size / 2 + 12}
        viewBox={`0 0 ${size} ${size / 2 + 12}`}
        className="overflow-visible"
        role="img"
        aria-label={`Depletion level: ${tierName}`}
      >
        {/* track */}
        <path
          d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* fill */}
        <path
          d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`}
          fill="none"
          stroke={arcColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      </svg>
      <div className="-mt-10 flex flex-col items-center">
        <span
          className="font-display text-5xl font-semibold"
          style={{ color: arcColor }}
        >
          {score}
          <span className="text-2xl text-muted-foreground font-sans font-normal">
            /{max}
          </span>
        </span>
        <span className="mt-1 text-sm uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
