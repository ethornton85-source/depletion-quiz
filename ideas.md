# Design Brainstorm — Depletion Quiz

## Three stylistic approaches

### 1. "Dusk Restoration"
A warm, earthy editorial aesthetic — terracotta, sage, and clay over cream, like a quiet evening at home after a long day. Feels grounded, honest, restorative.
Probability: 0.07

### 2. "Clinical Calm"
Cool clinical minimalism — soft blues and clean sans-serif, a credible "wellness science" feel.
Probability: 0.02

### 3. "Soft Maximalist Garden"
Lush botanical illustration, layered greens and blooms, playful and abundant.
Probability: 0.015

## CHOSEN: Dusk Restoration

**Design Movement:** Warm editorial / modern apothecary — think a thoughtful wellness magazine spread crossed with a calm botanical apothecary brand. Organic, tactile, unhurried.

**Core Principles:**
1. Earthy, low-saturation palette that feels like skin, clay, and plant — never sterile or "tech."
2. Generous whitespace and slow vertical rhythm; one idea per screen, like turning pages.
3. Honest, human typography — a warm serif for voice + a clean humanist sans for clarity.
4. Tactile depth via subtle grain, soft layered shadows, and organic blob/leaf shapes — no flat hard cards.

**Color Philosophy:** A grounded dusk palette. Warm cream paper (`#F6F0E8`) as base; deep clay/terracotta (`#B8694B`) as the signature warmth; sage/eucalyptus green (`#7C8B6F`) for calm and restoration; a deep espresso ink (`#3A3128`) for text. The emotional intent: walking from a stressful day into a calm, dim, candle-lit room.

**Layout Paradigm:** Asymmetric, off-center composition. The intro and result use a left-weighted editorial column with organic shapes floating to the side, not a dead-centered card. Quiz questions are a focused single-column with a slim organic progress indicator.

**Signature Elements:**
1. Organic hand-drawn blob/leaf shapes as background accents and to frame the depletion "meter."
2. A custom "depletion gauge" on the results page — an arc that fills to the tier, rendered with the brand palette.
3. Subtle paper grain texture overlay across the whole page.

**Interaction Philosophy:** Slow, soft, reassuring. Options gently lift and warm on hover; selecting advances with a soft cross-fade. Nothing snaps or flashes — motion mirrors the "downshift" the brand is selling.

**Animation:** Cross-fade + slight upward drift (8–12px) between questions, ~280ms ease-out. Options scale to 0.98 on press. Result page reveals in a staggered cascade (headline → gauge → message → tools → products), 60ms stagger. Respect prefers-reduced-motion.

**Typography System:** Display/voice = "Fraunces" (warm modern serif, optical). Body/UI = "Public Sans" or "Inter Tight" humanist sans. Headlines large, tight leading; body relaxed 1.6 leading. Use Fraunces italic for the warm "knowledgeable friend" lines.

**Brand Essence:** A wellness brand that tells working moms the honest truth about depletion — and gives them real tools, not platitudes. Personality: honest, warm, grounded.

**Brand Voice:** Like a sharp, caring friend who knows nervous-system science. Examples: "A breathing exercise isn't going to fix this — but this might." / "Your body isn't broken. It's been running on the wrong fuel."

**Wordmark & Logo:** A simple lowercase serif wordmark feel with a small hand-drawn leaf/ember mark. Logo = a minimal ember/leaf graphic symbol on transparent bg.

**Signature Brand Color:** Clay terracotta `#B8694B` — the warm ember.

## Fonts
Fraunces (display, serif) + Public Sans (body, sans) via Google Fonts.
