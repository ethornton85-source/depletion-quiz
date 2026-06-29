import type { VercelRequest, VercelResponse } from "@vercel/node";

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/7ftOvgxcZuwC2hykF1WU/webhook-trigger/4890a48c-2aec-4c37-ae26-93ed964f2f8c";

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

    res.json({ ok: true });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
}
