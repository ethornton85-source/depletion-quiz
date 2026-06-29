import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/7ftOvgxcZuwC2hykF1WU/webhook-trigger/4890a48c-2aec-4c37-ae26-93ed964f2f8c";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Quiz submission — forwards contact + results to GoHighLevel (AwesomeCRM)
  app.post("/api/submit", async (req, res) => {
    const { firstName, email, score, tier, tierName, dominantTag, openToProducts, flavorChoice } = req.body;

    if (!email || !firstName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const payload = {
        firstName,
        email,
        score,
        tier,
        tierName,
        dominantTag,
        openToProducts,
        flavorChoice,
        // GHL uses these standard fields for contact creation
        first_name: firstName,
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
  });

  // Serve static files
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
