import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/7ftOvgxcZuwC2hykF1WU/webhook-trigger/4890a48c-2aec-4c37-ae26-93ed964f2f8c";

type StateTag = "wired" | "flat" | "drained";
type Flavor = "grape" | "lemon-lime" | "black-cherry" | "any";

// ---- Cart links (kept in sync with client/src/lib/quizData.ts) ----
const CART_LINKS: Record<string, string> = {
  body: "https://nuevalife.com/share-cart?h=3a41c621-8d10-4b49-bd00-21d57f1dde0e",
  nitro_grape: "https://nuevalife.com/share-cart?h=a23c201d-72aa-4e01-b35b-a8d85f2412c0",
  nitro_lemon_lime: "https://nuevalife.com/share-cart?h=f172ef93-605f-4762-b8f2-cbcf7234a250",
  nitro_black_cherry: "https://nuevalife.com/share-cart?h=9a7f7d2b-d1a6-4075-acb9-dca9245ce517",
  nitro_any: "https://nuevalife.com/share-cart?h=a544df40-ffb0-4cb4-bf01-5913b8735b68",
  bundle_grape: "https://nuevalife.com/share-cart?h=10e2d475-2ff8-47fe-8c10-7f7faa2e89fb",
  bundle_lemon_lime: "https://nuevalife.com/share-cart?h=6a61e1db-c344-40e4-b6a1-402386a2e06a",
  bundle_black_cherry: "https://nuevalife.com/share-cart?h=e878a61e-281e-46a8-8384-c9453281732f",
  bundle_any: "https://nuevalife.com/share-cart?h=a544df40-ffb0-4cb4-bf01-5913b8735b68",
};

function getCartLink(flavor: Flavor) {
  const key = flavor === "lemon-lime" ? "lemon_lime" : flavor === "black-cherry" ? "black_cherry" : flavor;
  return {
    nitroUrl: CART_LINKS[`nitro_${key}`] ?? CART_LINKS.nitro_any,
    bodyUrl: CART_LINKS.body,
    bundleUrl: CART_LINKS[`bundle_${key}`] ?? CART_LINKS.bundle_any,
  };
}

// ---- Ritual tools (kept in sync with client/src/lib/quizData.ts) ----
const RITUAL_TOOLS: Record<string, { name: string; description: string; forTags: StateTag[] }> = {
  emdr: {
    name: "EMDR bilateral audio on the drive home",
    description:
      "Slow, alternating left-right tones help your brain discharge the day's tension before you reach the door. Press play the moment you pull out of the lot.",
    forTags: ["wired", "flat", "drained"],
  },
  vision: {
    name: "The narrowing-vision technique",
    description:
      "At a red light, cup your hands lightly at the sides of your eyes like blinders for a few breaths. Narrowing your visual field gently signals your ventral vagal system that you're safe.",
    forTags: ["wired"],
  },
  vagus: {
    name: "Steering-wheel vagus pressure",
    description:
      "Wrap both hands around the wheel and apply slow, firm pressure for 20–30 seconds. The steady proprioceptive input nudges you out of fight-or-flight.",
    forTags: ["wired"],
  },
  dive: {
    name: "The dive reflex reset",
    description:
      "Splash cold water on your face and inner wrists before you walk in (or keep a chilled cloth in the car). Cold on the face triggers a fast parasympathetic 'brake.'",
    forTags: ["drained", "wired"],
  },
  peppermint: {
    name: "Peppermint scent or candy",
    description:
      "A sharp, clean sensory hit lifts flat, shut-down energy without caffeine. Keep tins in the car and your bag for the transition window.",
    forTags: ["flat", "drained"],
  },
  intention: {
    name: "The 2-minute doorway intention",
    description:
      "Before you turn the handle, sit for two minutes and name one way you want to show up tonight. It marks a clean line between 'work you' and 'home you.'",
    forTags: ["flat", "drained", "wired"],
  },
};

function pickTools(dominantTag: StateTag, count = 4) {
  const entries = Object.values(RITUAL_TOOLS);
  const primary = entries.filter((t) => t.forTags.includes(dominantTag));
  const rest = entries.filter((t) => !t.forTags.includes(dominantTag));
  return [...primary, ...rest].slice(0, count);
}

const FLAVOR_LABEL: Record<Flavor, string> = {
  grape: "Grape",
  "lemon-lime": "Lemon Lime",
  "black-cherry": "Black Cherry",
  any: "your choice of flavor",
};

const TIER_CONTENT: Record<number, { name: string; headline: string; body: string[]; showNitro: boolean; showBody: boolean }> = {
  1: {
    name: "Situationally Depleted",
    headline: "You're having a hard stretch — and your nervous system needs a reset, not an overhaul.",
    body: [
      "The good news: your body still has reserves. What you're feeling is real, but it's situational.",
      "What you need most right now is a reliable transition ritual: a way to shift out of work mode before you walk through the door, so the day doesn't follow you inside.",
    ],
    showNitro: false,
    showBody: false,
  },
  2: {
    name: "Chronically Running on Empty",
    headline: "This isn't a bad week. Your body has been running on stress hormones instead of real energy.",
    body: [
      "The transition ritual below will help, and you should absolutely use it tonight. But here's the honest part: at this level, your mitochondria — the parts of your cells that produce natural energy — have been depleted.",
      "To keep you upright, your body learned to substitute stress hormones like cortisol. That's why nothing feels restorative anymore — you're running the engine on the emergency reserve.",
    ],
    showNitro: true,
    showBody: false,
  },
  3: {
    name: "Hitting a Wall",
    headline: "Your body is telling you something important. This goes beyond stress management.",
    body: [
      "What you're describing isn't burnout in the pop-culture sense — it's your nervous system running on fumes because your body has depleted the raw materials it needs to produce natural energy.",
      "Rituals and mindset shifts help, and they matter. But they won't rebuild what's been depleted at the cellular level. That's where targeted support comes in.",
      "This is not medical advice. If you're concerned about your health, please speak with a clinician you trust — what you're experiencing warrants real attention.",
    ],
    showNitro: true,
    showBody: true,
  },
};

function buildEmailHtml(opts: {
  firstName: string;
  tier: number;
  dominantTag: StateTag;
  flavorChoice: Flavor;
  openToProducts: string;
}) {
  const { firstName, tier, dominantTag, flavorChoice, openToProducts } = opts;
  const content = TIER_CONTENT[tier] ?? TIER_CONTENT[3];
  const tools = pickTools(dominantTag);
  const { nitroUrl, bodyUrl, bundleUrl } = getCartLink(flavorChoice);
  const flavorLabel = FLAVOR_LABEL[flavorChoice];
  const wantsProducts = openToProducts !== "no";

  const toolsHtml = tools
    .map(
      (t) => `
      <div style="margin-bottom:18px;padding:16px 18px;background:#f7f3fb;border-radius:14px;border:1px solid #e7defa;">
        <p style="margin:0 0 6px;font-weight:600;color:#3d2a55;font-size:15px;">${t.name}</p>
        <p style="margin:0;color:#5a4a6e;font-size:14px;line-height:1.55;">${t.description}</p>
      </div>`,
    )
    .join("");

  const bodyHtml = content.body
    .map((p) => `<p style="margin:0 0 14px;color:#4a3a5e;font-size:15px;line-height:1.65;">${p}</p>`)
    .join("");

  let productsHtml = "";
  if (wantsProducts && (content.showNitro || content.showBody)) {
    const nitroCard = content.showNitro
      ? `<a href="${nitroUrl}" style="display:block;margin-bottom:12px;padding:16px 18px;background:#ffffff;border-radius:14px;border:1px solid #e7defa;text-decoration:none;">
          <p style="margin:0 0 4px;font-weight:600;color:#7c4fd6;font-size:15px;">Nueva Nitro — ${flavorLabel}</p>
          <p style="margin:0;color:#5a4a6e;font-size:13.5px;">Hydrogen water for cellular energy, without the stimulant crash. →</p>
        </a>`
      : "";
    const bodyCard = content.showBody
      ? `<a href="${bodyUrl}" style="display:block;margin-bottom:12px;padding:16px 18px;background:#ffffff;border-radius:14px;border:1px solid #e7defa;text-decoration:none;">
          <p style="margin:0 0 4px;font-weight:600;color:#7c4fd6;font-size:15px;">Nueva Body</p>
          <p style="margin:0;color:#5a4a6e;font-size:13.5px;">Mitochondrial support to help rebuild your cellular energy baseline. →</p>
        </a>`
      : "";
    const bundleCta = content.showNitro && content.showBody
      ? `<a href="${bundleUrl}" style="display:inline-block;margin-top:8px;padding:14px 28px;background:#7c4fd6;color:#ffffff;border-radius:999px;text-decoration:none;font-weight:600;font-size:14.5px;">Get the full bundle →</a>`
      : "";

    productsHtml = `
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid #e7defa;">
        <p style="margin:0 0 14px;font-weight:600;color:#3d2a55;font-size:16px;">Where to start rebuilding your baseline</p>
        ${nitroCard}
        ${bodyCard}
        ${bundleCta}
        ${content.showNitro && content.showBody ? `<p style="margin-top:10px;font-size:11.5px;color:#8a7a9e;">This is not medical advice. Consult your doctor before starting any new supplement.</p>` : ""}
      </div>`;
  }

  return `
  <div style="background:#f4eefa;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:36px 32px;">
      <p style="margin:0 0 6px;color:#9a7fc9;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;">Your results</p>
      <h1 style="margin:0 0 18px;color:#3d2a55;font-size:24px;line-height:1.35;">Hi ${firstName}, here's where you're at:</h1>
      <p style="margin:0 0 6px;font-weight:600;color:#7c4fd6;font-size:18px;">${content.name}</p>
      <p style="margin:0 0 20px;color:#3d2a55;font-size:16px;line-height:1.5;font-style:italic;">${content.headline}</p>
      ${bodyHtml}
      <p style="margin:24px 0 14px;font-weight:600;color:#3d2a55;font-size:16px;">Your custom transition protocol</p>
      ${toolsHtml}
      ${productsHtml}
      <p style="margin-top:32px;color:#8a7a9e;font-size:13px;">— Erin</p>
    </div>
  </div>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { firstName, email, score, tier, tierName, dominantTag, openToProducts, flavorChoice } = req.body;

  if (!email || !firstName) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Forward lead to GHL for CRM storage / nurture sequence
  try {
    const payload = {
      firstName,
      email,
      first_name: firstName,
      score,
      tier,
      tierName,
      dominantTag,
      openToProducts,
      flavorChoice,
      tags: [
        `depletion-tier-${tier}`,
        `ns-${dominantTag}`,
        openToProducts !== "no" ? "product-open" : "product-no",
        flavorChoice !== "any" ? `flavor-${flavorChoice}` : "flavor-open",
      ],
    };

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("GHL webhook error:", response.status, await response.text());
    }
  } catch (err) {
    console.error("GHL forward error:", err);
  }

  // Send personalized results email via Resend
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = buildEmailHtml({ firstName, tier, dominantTag, flavorChoice, openToProducts });
      await resend.emails.send({
        from: "Erin Iannarelli <onboarding@resend.dev>",
        to: email,
        subject: `${firstName}, here are your depletion quiz results`,
        html,
      });
    } else {
      console.error("RESEND_API_KEY not set — skipping personalized email");
    }
  } catch (err) {
    console.error("Resend send error:", err);
  }

  res.json({ ok: true });
}
