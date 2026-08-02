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