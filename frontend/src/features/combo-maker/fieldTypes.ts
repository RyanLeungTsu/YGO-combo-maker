import type { Card } from "../../types/card";

export const MAIN_MONSTER_ZONES = [
  "Main-1",
  "Main-2",
  "Main-3",
  "Main-4",
  "Main-5",
] as const;
export const EXTRA_MONSTER_ZONES = ["Extra-1", "Extra-2"] as const;
export const SPELL_TRAP_ZONES = [
  "S/T-1",
  "S/T-2",
  "S/T-3",
  "S/T-4",
  "S/T-5",
] as const;
export const FIELD_ZONE = ["field"] as const;

export const ALL_ZONES = [
  ...MAIN_MONSTER_ZONES,
  ...EXTRA_MONSTER_ZONES,
  ...SPELL_TRAP_ZONES,
  ...FIELD_ZONE,
] as const;
export type ZoneId = (typeof ALL_ZONES)[number];

export interface StepFieldChanges {
  // cards entering a zone
  placements?: { zone: ZoneId; cardId: number }[];
  //   cards cleared in a zone
  vacates?: ZoneId[];
}

// for end board card placements
export const CARD_ORIENTATIONS = ["face-up", "face-down", "face-up-defense", "face-down-defense"] as const;
export type CardOrientation = (typeof CARD_ORIENTATIONS)[number];

// for GY, Banished, Hand Zones on End Board
export const EXTRA_BOARD_ZONES = ["gy", "banished", "hand"] as const;
export type ExtraBoardZone = (typeof EXTRA_BOARD_ZONES)[number];

// for xyz cards
export interface PlacedCard {
  card: Card;
  orientation: CardOrientation;
  materials?: Card[];
}