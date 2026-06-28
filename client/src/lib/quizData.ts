// Quiz content & scoring model for "How Depleted Are You Really?"
// See quiz-spec.md for the source-of-truth.

export type StateTag = "wired" | "flat" | "drained";

export interface Option {
  label: string;
  points: number;
  tag?: StateTag;
}

export interface Question {
  id: number;
  prompt: string;
  helper?: string;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "How do you feel most mornings when you wake up?",
    options: [
      { label: "Refreshed — ready for the day", points: 0 },
      { label: "Tired, but functional", points: 1 },
      { label: "Exhausted before the day even starts", points: 2 },
    ],
  },
  {
    id: 2,
    prompt: "By the time you get home from work, you feel…",
    options: [
      { label: "Actually okay, mostly", points: 0, tag: "flat" },
      { label: "Wired and tense — can't switch off", points: 1, tag: "wired" },
      { label: "Flat and checked out", points: 1, tag: "flat" },
      { label: "Completely drained — like nothing's left", points: 2, tag: "drained" },
    ],
  },
  {
    id: 3,
    prompt: "How often do you snap at your kids or partner in the evenings?",
    helper: "Be honest — no one's judging.",
    options: [
      { label: "Rarely", points: 0 },
      { label: "A few times a week", points: 1 },
      { label: "Almost every day", points: 2 },
    ],
  },
  {
    id: 4,
    prompt: "How would you describe your energy through the day?",
    options: [
      { label: "Mostly steady", points: 0 },
      { label: "Peaks and crashes", points: 1, tag: "flat" },
      { label: "Running on caffeine or stress just to get through", points: 2, tag: "wired" },
    ],
  },
  {
    id: 5,
    prompt: "How do you feel after a full night of sleep?",
    options: [
      { label: "Restored", points: 0 },
      { label: "Somewhat better, but still tired", points: 1 },
      { label: "Sleep doesn't seem to help much anymore", points: 2 },
    ],
  },
  {
    id: 6,
    prompt: "When you try to be present with your family, it feels…",
    options: [
      { label: "Natural, most of the time", points: 0 },
      { label: "Like I have to force it", points: 1 },
      { label: "Impossible — physically there, mentally gone", points: 2, tag: "drained" },
    ],
  },
  {
    id: 7,
    prompt: "How long have you felt this way?",
    options: [
      { label: "A few weeks", points: 0 },
      { label: "Several months", points: 1 },
      { label: "I can't remember feeling any other way", points: 2 },
    ],
  },
];

export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0,
);

// ---- Ritual tools ----
export interface RitualTool {
  key: string;
  name: string;
  description: string;
  forTags: StateTag[];
}

export const RITUAL_TOOLS: RitualTool[] = [
  {
    key: "emdr",
    name: "EMDR bilateral audio on the drive home",
    description:
      "Slow, alternating left-right tones help your brain discharge the day's tension before you reach the door. Press play the moment you pull out of the lot.",
    forTags: ["wired", "flat", "drained"],
  },
  {
    key: "vision",
    name: "The narrowing-vision technique",
    description:
      "At a red light, cup your hands lightly at the sides of your eyes like blinders for a few breaths. Narrowing your visual field gently signals your ventral vagal system that you're safe.",
    forTags: ["wired"],
  },
  {
    key: "vagus",
    name: "Steering-wheel vagus pressure",
    description:
      "Wrap both hands around the wheel and apply slow, firm pressure for 20–30 seconds. The steady proprioceptive input nudges you out of fight-or-flight.",
    forTags: ["wired"],
  },
  {
    key: "dive",
    name: "The dive reflex reset",
    description:
      "Splash cold water on your face and inner wrists before you walk in (or keep a chilled cloth in the car). Cold on the face triggers a fast parasympathetic 'brake.'",
    forTags: ["drained", "wired"],
  },
  {
    key: "peppermint",
    name: "Peppermint scent or candy",
    description:
      "A sharp, clean sensory hit lifts flat, shut-down energy without caffeine. Keep tins in the car and your bag for the transition window.",
    forTags: ["flat", "drained"],
  },
  {
    key: "intention",
    name: "The 2-minute doorway intention",
    description:
      "Before you turn the handle, sit for two minutes and name one way you want to show up tonight. It marks a clean line between 'work you' and 'home you.'",
    forTags: ["flat", "drained", "wired"],
  },
];

export function pickTools(tagCounts: Record<StateTag, number>, count = 4): RitualTool[] {
  // dominant tag = most-selected; tie favors order wired > drained > flat
  const order: StateTag[] = ["wired", "drained", "flat"];
  const dominant = order.reduce((best, t) =>
    tagCounts[t] > tagCounts[best] ? t : best,
  order[0]);

  const primary = RITUAL_TOOLS.filter((t) => t.forTags.includes(dominant));
  const rest = RITUAL_TOOLS.filter((t) => !t.forTags.includes(dominant));
  const ordered = [...primary, ...rest];
  return ordered.slice(0, count);
}

// ---- Products (Tier 2 & 3) ----
export interface Product {
  name: string;
  tagline: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    name: "Hydrogen Water",
    tagline: "The daily reset for tired cells",
    description:
      "Supports your cells' own antioxidant defenses and helps your mitochondria run cleaner — so the energy you make actually feels like energy.",
  },
  {
    name: "Alcitonine Complex",
    tagline: "Rebuilding the baseline",
    description:
      "A targeted compound that supports mitochondrial restoration — helping repair the machinery that's been running on fumes.",
  },
  {
    name: "SLU-PP-332 + 5-Amino-1MQ",
    tagline: "Teaching your body to make energy again",
    description:
      "These compounds support mitochondrial biogenesis and NAD+ metabolism — in plain terms, they help your body rebuild its own capacity to produce natural energy, instead of borrowing it from stress hormones.",
  },
];

// ---- Tiers ----
export type TierId = 1 | 2 | 3;

export interface Tier {
  id: TierId;
  name: string;
  range: [number, number];
  headline: string;
  intro: string;
  body: string[]; // paragraphs
  toolsLead: string;
  showProducts: boolean;
  productsLead?: string;
  primaryCta: { label: string; kind: "guide" | "products" };
  secondaryCta?: { label: string; kind: "guide" | "products" };
  gaugeLabel: string;
}

export const TIERS: Tier[] = [
  {
    id: 1,
    name: "Situationally Depleted",
    range: [0, 5],
    headline: "You're having a hard stretch — and your nervous system needs a reset, not an overhaul.",
    intro: "The good news: your body still has reserves.",
    body: [
      "What you're feeling is real, but it's situational. You haven't burned through your foundation — you've just been stuck in 'on' for too long without a clean way to power down.",
      "What you need most right now is a reliable transition ritual: a way to shift out of work mode *before* you walk through the door, so the day doesn't follow you inside. Here's a protocol built from your answers.",
    ],
    toolsLead: "Your custom transition protocol",
    showProducts: false,
    primaryCta: { label: "Download the Nervous System Reset Guide", kind: "guide" },
    gaugeLabel: "Reserves intact",
  },
  {
    id: 2,
    name: "Chronically Running on Empty",
    range: [6, 10],
    headline: "This isn't a bad week. Your body has been running on stress hormones instead of real energy.",
    intro: "And that's a deeper problem than any single ritual can fix.",
    body: [
      "The transition ritual below will help, and you should absolutely use it tonight. But here's the honest part: at this level, your mitochondria — the parts of your cells that produce natural energy — have been depleted.",
      "To keep you upright, your body learned to substitute stress hormones like cortisol. That's *why* nothing feels restorative anymore: you're running the engine on the emergency reserve. You can't ritual your way out of a cellular deficit.",
      "So this is a two-part answer. Use the protocol tonight to get relief — and start giving your body the raw materials to rebuild its baseline over time.",
    ],
    toolsLead: "For tonight: your transition protocol",
    showProducts: true,
    productsLead: "Over time: rebuilding your baseline",
    primaryCta: { label: "Explore the products", kind: "products" },
    secondaryCta: { label: "Download the Reset Guide", kind: "guide" },
    gaugeLabel: "Running on cortisol",
  },
  {
    id: 3,
    name: "Hitting a Wall",
    range: [11, 14],
    headline: "Your body is telling you something important. This goes beyond stress management.",
    intro: "What you're describing isn't burnout in the pop-culture sense.",
    body: [
      "It's your nervous system running on fumes because your body has depleted the raw materials it needs to produce natural energy. Cortisol and adrenaline have been filling the gap — but they were never meant to be your primary fuel source.",
      "Rituals and mindset shifts help, and I'll give you those — they're real and they matter. But honestly? They won't rebuild what's been depleted at the cellular level. That's where targeted support comes in.",
      "Your body knows how to regulate itself. It just needs the raw materials to do it. Start there, and use the ritual tools as supportive practice while your baseline comes back online.",
    ],
    toolsLead: "Supportive practice (use these too)",
    showProducts: true,
    productsLead: "Where to actually start: rebuilding the raw materials",
    primaryCta: { label: "Explore the products", kind: "products" },
    secondaryCta: { label: "Download the Reset Guide", kind: "guide" },
    gaugeLabel: "Running on empty",
  },
];

export function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ?? TIERS[2];
}
