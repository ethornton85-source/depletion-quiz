/* DESIGN: Dusk Restoration. Warm "your results are ready" bridge, gentle
   form, clay CTA. Privacy-reassuring microcopy. */
import { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

interface Props {
  onSubmit: (data: { firstName: string; email: string }) => void;
}

const LEAF = "/manus-storage/leaf-accent_b5be5ad8.png";

export default function EmailGate({ onSubmit }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function valid(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!firstName.trim()) {
      setError("Just your first name — so we can make this personal.");
      return;
    }
    if (!valid(email)) {
      setError("That email doesn't look quite right. Mind checking it?");
      return;
    }
    setError("");
    setLoading(true);
    // simulate a brief send; in production wire to your ESP/CRM
    setTimeout(() => onSubmit({ firstName: firstName.trim(), email: email.trim() }), 900);
  }

  return (
    <div className="container flex min-h-screen max-w-md flex-col items-center justify-center py-12">
      <div className="anim-rise w-full rounded-[2rem] border border-border bg-card p-7 shadow-2xl shadow-ink/10 sm:p-9">
        <img src={LEAF} alt="" className="mx-auto h-14 w-14" />
        <h2 className="mt-4 text-center font-display text-3xl font-600 leading-tight text-ink">
          Your results are ready.
        </h2>
        <p className="mt-2 text-center text-ink/75">
          Where should we send them? We'll show your personalized report on the
          next screen and email you a copy with your full reset guide.
        </p>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-sm font-600 text-ink/80">
              First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-600 text-ink/80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="press mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-clay px-7 py-4 text-base font-600 text-primary-foreground shadow-lg shadow-clay/25 transition hover:bg-clay-deep disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Preparing your report…
              </>
            ) : (
              <>
                Show my results <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
