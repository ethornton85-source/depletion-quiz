// Quiz content & scoring model for "How Depleted Are You Really?"
// See quiz-spec.md for the source-of-truth.

export type StateTag = "wired" | "flat" | "drained";
export type Flavor = "grape" | "lemon-lime" | "black-cherry" | "any";
export type ProductOpenness = "yes" | "maybe" | "no";

export interface Option {
  label: string;
  points: number;
  tag?: StateTag;
  flavor?: Flavor;
  productOpen?: ProductOpenness;
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
  {
    id: 8,
    prompt: "What's your hardest moment in the transition from work to home?",
    options: [
      { label: "Walking in the door — I come in tense and can't decompress", points: 1, tag: "wired" },
      { label: "Getting off the couch — I'm so flat I can barely engage", points: 1, tag: "flat" },
      { label: "I'm physically there but mentally I've already checked out", points: 2, tag: "drained" },
      { label: "Most days the transition feels okay", points: 0 },
    ],
  },
  {
    id: 9,
    prompt: "Are you open to exploring products that support your nervous system and energy recovery?",
    helper: "No pressure either way — this just helps personalize your results.",
    options: [
      { label: "Yes, I'm open to whatever helps", points: 0, productOpen: "yes" },
      { label: "Maybe — tell me more first", points: 0, productOpen: "maybe" },
      { label: "I prefer strategies only for now", points: 0, productOpen: "no" },
    ],
  },
  {
    id: 10,
    prompt: "Hydrogen water supports cellular energy without stimulants or a crash. If it felt right for you, which flavor sounds most appealing?",
    helper: "Nueva Nitro comes in three flavors — pick your vibe.",
    options: [
      { label: "🍇 Grape", points: 0, flavor: "grape" },
      { label: "🍋 Lemon Lime", points: 0, flavor: "lemon-lime" },
      { label: "🍒 Black Cherry", points: 0, flavor: "black-cherry" },
      { label: "I'd try anything", points: 0, flavor: "any" },
    ],
  },
];

export const MAX_SCORE = QUESTIONS.slice(0, 7).reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0,
);

// ---- Cart links — fill these in with your actual Nueva Life share-cart URLs ----
export const CART_LINKS: Record<string, string> = {
  // Nueva Body only
  body: "https://nuevalife.com/share-cart?h=3a41c621-8d10-4b49-bd00-21d57f1dde0e",
  // Nueva Nitro by flavor
  nitro_grape: "https://nuevalife.com/share-cart?h=a23c201d-72aa-4e01-b35b-a8d85f2412c0",
  nitro_lemon_lime: "https://nuevalife.com/share-cart?h=f172ef93-605f-4762-b8f2-cbcf7234a250",
  nitro_black_cherry: "https://nuevalife.com/share-cart?h=9a7f7d2b-d1a6-4075-acb9-dca9245ce517",
  nitro_any: "https://nuevalife.com/share-cart?h=a544df40-ffb0-4cb4-bf01-5913b8735b68",
  // Bundles (Body + Nitro)
  bundle_grape: "https://nuevalife.com/share-cart?h=10e2d475-2ff8-47fe-8c10-7f7faa2e89fb",
  bundle_lemon_lime: "https://nuevalife.com/share-cart?h=6a61e1db-c344-40e4-b6a1-402386a2e06a",
  bundle_black_cherry: "https://nuevalife.com/share-cart?h=e878a61e-281e-46a8-8384-c9453281732f",
  bundle_any: "https://nuevalife.com/share-cart?h=a544df40-ffb0-4cb4-bf01-5913b8735b68",
};

export function getCartLink(tier: number, flavor: Flavor): { nitroUrl: string; bodyUrl: string; bundleUrl: string } {
  const flavorKey = flavor === "lemon-lime" ? "lemon_lime" : flavor === "black-cherry" ? "black_cherry" : flavor;
  return {
    nitroUrl: CART_LINKS[`nitro_${flavorKey}`] ?? CART_LINKS.nitro_any,
    bodyUrl: CART_LINKS.body,
    bundleUrl: CART_LINKS[`bundle_${flavorKey}`] ?? CART_LINKS.bundle_any,
  };
}

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
  const order: StateTag[] = ["wired", "drained", "flat"];
  const dominant = order.reduce((best, t) =>
    tagCounts[t] > tagCounts[best] ? t : best,
  order[0]);

  const primary = RITUAL_TOOLS.filter((t) => t.forTags.includes(dominant));
  const rest = RITUAL_TOOLS.filter((t) => !t.forTags.includes(dominant));
  return [...primary, ...rest].slice(0, count);
}

// ---- Tiers ----
export type TierId = 1 | 2 | 3;

export interface Tier {
  id: TierId;
  name: string;
  range: [number, number];
  headline: string;
  intro: string;
  body: string[];
  toolsLead: string;
  showNitro: boolean;
  showBody: boolean;
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
      "What you need most right now is a reliable transition ritual: a way to shift out of work mode before you walk through the door, so the day doesn't follow you inside. Here's a protocol built from your answers.",
    ],
    toolsLead: "Your custom transition protocol",
    showNitro: true,
    showBody: true,
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
      "To keep you upright, your body learned to substitute stress hormones like cortisol. That's why nothing feels restorative anymore: you're running the engine on the emergency reserve.",
      "Use the protocol tonight to get relief — and give your body the raw materials to rebuild its baseline over time.",
    ],
    toolsLead: "For tonight: your transition protocol",
    showNitro: true,
    showBody: true,
    productsLead: "Over time: rebuilding your baseline",
    primaryCta: { label: "Get the products", kind: "products" },
    secondaryCta: { label: "Download the Reset Guide", kind: "guide" },
    gaugeLabel: "Running on cortisol",
  },
  {
    id: 3,
    name: "Hitting a Wall",
    range: [11, 20],
    headline: "Your body is telling you something important. This goes beyond stress management.",
    intro: "What you're describing isn't burnout in the pop-culture sense.",
    body: [
      "It's your nervous system running on fumes because your body has depleted the raw materials it needs to produce natural energy. Cortisol and adrenaline have been filling the gap — but they were never meant to be your primary fuel source.",
      "Rituals and mindset shifts help, and I'll give you those — they're real and they matter. But they won't rebuild what's been depleted at the cellular level. That's where targeted support comes in.",
      "Your body knows how to regulate itself. It just needs the raw materials to do it. Start there, and use the ritual tools as supportive practice while your baseline comes back online.",
      "This is not medical advice. If you're concerned about your health, please speak with a clinician you trust — what you're experiencing warrants real attention.",
    ],
    toolsLead: "Supportive practice (use these too)",
    showNitro: true,
    showBody: true,
    productsLead: "Where to actually start: rebuilding the raw materials",
    primaryCta: { label: "Get the full bundle", kind: "products" },
    secondaryCta: { label: "Download the Reset Guide", kind: "guide" },
    gaugeLabel: "Running on empty",
  },
];

export function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.range[0] && score <= t.range[1]) ?? TIERS[2];
}
