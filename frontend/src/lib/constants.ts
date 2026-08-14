export const CARD_TYPES = [
  "Normal Monster",
  "Effect Monster",
  "Ritual Monster",
  "Fusion Monster",
  "Synchro Monster",
  "Xyz Monster",
  "Link Monster",
  "Pendulum Effect Monster",
  "Spell Card",
  "Trap Card",
] as const;

export const CARD_ATTRIBUTES = [
  "DARK",
  "LIGHT",
  "EARTH",
  "WATER",
  "FIRE",
  "WIND",
  "DIVINE",
] as const;

// for levels on yu-gi-oh cards
export const CARD_LEVELS = Array.from({ length: 13 }, (_, i) => i + 1);

// min deck reqs
export const DECK_LIMITS = {
  main: { min: 40, max: 60 },
  extra: { min: 0, max: 15 },
  side: { min: 0, max: 15 },
} as const;

// max copies of a card allowed in a deck
export const MAX_COPIES = 3;

// for extra deck monsters
export const EXTRA_DECK_TYPES = [
  "Fusion Monster",
  "Synchro Monster",
  "Xyz Monster",
  "Link Monster",
] as const;
// =====================
// deck sorting
// =====================

// for sorting order
export const CARD_CATEGORY_ORDER: Record<string, number> = {
  monster: 0,
  spell: 1,
  trap: 2,
};

// spell sort order
export const SPELL_SUBTYPE_ORDER: Record<string, number> = {
  "Normal Spell Card": 0,
  "Spell Card": 0,
  "Equip Spell Card": 1,
  "Ritual Spell Card": 2,
  "Quick-Play Spell Card": 3,
  "Continuous Spell Card": 4,
  "Field Spell Card": 5,
};

// trap sort order
export const TRAP_SUBTYPE_ORDER: Record<string, number> = {
  "Normal Trap Card": 0,
  "Trap Card": 0,
  "Continuous Trap Card": 1,
  "Counter Trap Card": 2,
};

export function getCardType(type: string): "monster" | "spell" | "trap" {
  if (type.includes("Spell")) return "spell";
  if (type.includes("Trap")) return "trap";
  return "monster";
}
