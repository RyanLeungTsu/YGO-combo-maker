import type { DeckState, Violation } from "../deckTypes";
import { MAX_COPIES } from "../../../lib/constants";

export function checkCardLimits(deck: DeckState): Violation[] {
  const allCards = [...deck.main, ...deck.extra, ...deck.side];
  const counts = new Map<number, { name: string; count: number }>();

  for (const card of allCards) {
    const existing = counts.get(card.id);
    if (existing) {
      existing.count++;
    } else {
      counts.set(card.id, { name: card.name, count: 1 });
    }
  }

  const violations: Violation[] = [];
  for (const { name, count } of counts.values()) {
    if (count > MAX_COPIES) {
      violations.push({
        rule: "card-limit",
        message: `${count} copies of '${name}' (max ${MAX_COPIES})`,
        severity: "warning",
      });
    }
  }

  return violations;
}