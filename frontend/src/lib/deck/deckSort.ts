import type { Card } from "../../types/card";
import {
  CARD_CATEGORY_ORDER,
  SPELL_SUBTYPE_ORDER,
  TRAP_SUBTYPE_ORDER,
  getCardType,
} from "../constants";

export function compareDeckCards(a: Card, b: Card): number {
  const categoryA = getCardType(a.type);
  const categoryB = getCardType(b.type);

  if (categoryA !== categoryB) {
    return CARD_CATEGORY_ORDER[categoryA] - CARD_CATEGORY_ORDER[categoryB];
  }

  //   monster sort
  if (categoryA === "monster") {
    const levelA = a.level ?? 0;
    const levelB = b.level ?? 0;
    if (levelA !== levelB) return levelA - levelB;
    return a.name.localeCompare(b.name);
  }

  //   spell sort
  if (categoryA === "spell") {
    const orderA = SPELL_SUBTYPE_ORDER[a.type] ?? 99;
    const orderB = SPELL_SUBTYPE_ORDER[b.type] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  }

  // trap sort
  const orderA = TRAP_SUBTYPE_ORDER[a.type] ?? 99;
  const orderB = TRAP_SUBTYPE_ORDER[b.type] ?? 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.name.localeCompare(b.name);
}

export function sortDeckCards(cards: Card[]): Card[] {
  return [...cards].sort(compareDeckCards);
}
