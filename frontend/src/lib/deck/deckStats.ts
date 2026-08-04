import type { DeckState } from "../../features/deck-builder/deckTypes";

export interface StatBucket {
  name: string;
  count: number;
}

export function getTypeDistribution(deck: DeckState): StatBucket[] {
  const all = [...deck.main, ...deck.extra, ...deck.side];
  const counts = new Map<string, number>();
  for (const card of all) {
    counts.set(card.type, (counts.get(card.type) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }));
}

export function getAttributeDistribution(deck: DeckState): StatBucket[] {
  const all = [...deck.main, ...deck.extra, ...deck.side];
  const counts = new Map<string, number>();
  for (const card of all) {
    if (!card.attribute) continue;
    counts.set(card.attribute, (counts.get(card.attribute) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count }));
}