/* Email gate — collects name, email, phone, country then submits to GHL form */
import { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

interface Props {
  onSubmit: (data: { firstName: string; email: string; phone: string; country: string }) => void;
}

const GHL_FORM_ID = "2dAAKmViTN9IiQhBtY56";
const GHL_FORM_URL = `https://link.awesomecrm.com/widget/form/${GHL_FORM_ID}`;

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "New Zealand",
  "Ireland", "South Africa", "Other",
];

export default function EmailGate({ onSubmit }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!firstName.trim()) { setError("Just your first name — so we can make this personal."); return; }
    if (!validEmail(email)) { setError("That email doesn't look quite right. Mind checking it?"); return; }
    if (!phone.trim()) { setError("We need your phone number to send your results."); return; }
    if (!country) { setError("Please select your country."); return; }

    setError("");
    setLoading(true);

    // Submit to GHL form
    try {
      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("country", country);
      formData.append("formId", GHL_FORM_ID);
      formData.append("location_id", "7ftOvgxcZuwC2hykF1WU");

      await fetch(GHL_FORM_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
    } catch {
      // no-cors means we can't read the response — that's expected, submission still goes through
    }

    onSubmit({ firstName: firstName.trim(), email: email.trim(), phone: phone.trim(), country });
  }

  return (
    <div className="container flex min-h-screen max-w-md flex-col items-center justify-center py-12">
      <div className="anim-rise w-full rounded-[2rem] border border-border bg-card p-7 shadow-2xl shadow-ink/10 sm:p-9">
        <h2 className="mt-4 text-center font-display text-3xl font-semibold leading-tight text-ink">
          Your results are ready.
        </h2>
        <p className="mt-2 text-center text-ink/75">
          Where should we send them? We'll show your personalized report on the
          next screen and email you a copy with your full reset guide.
        </p>

        <form onSubmit={submit} className="mt-7 flex flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink/80">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Sarah"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink/80">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink/80">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-ink outline-none transition focus:border-lavender focus:ring-2 focus:ring-lavender/25"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="press mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-lavender px-7 py-4 text-base font-semibold text-white shadow-lg shadow-lavender/25 transition hover:bg-lavender-deep disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Preparing your report…</>
            ) : (
              <>Show my results <ArrowRight className="h-5 w-5" /></>
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
