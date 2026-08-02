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