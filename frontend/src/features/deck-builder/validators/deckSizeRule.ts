import type { DeckState, Violation } from "../deckTypes";
import { DECK_LIMITS } from "../../../lib/constants";

export function checkDeckSize(deck: DeckState): Violation[] {
  const violations: Violation[] = [];

  if (deck.main.length < DECK_LIMITS.main.min) {
    violations.push({
      rule: "main-deck-min",
      message: `Main Deck has ${deck.main.length} cards (minimum ${DECK_LIMITS.main.min})`,
      severity: "warning",
    });
  }
  if (deck.main.length > DECK_LIMITS.main.max) {
    violations.push({
      rule: "main-deck-max",
      message: `Main Deck has ${deck.main.length} cards (maximum ${DECK_LIMITS.main.max})`,
      severity: "warning",
    });
  }
  if (deck.extra.length > DECK_LIMITS.extra.max) {
    violations.push({
      rule: "extra-deck-max",
      message: `Extra Deck has ${deck.extra.length} cards (maximum ${DECK_LIMITS.extra.max})`,
      severity: "warning",
    });
  }
  if (deck.side.length > DECK_LIMITS.side.max) {
    violations.push({
      rule: "side-deck-max",
      message: `Side Deck has ${deck.side.length} cards (maximum ${DECK_LIMITS.side.max})`,
      severity: "warning",
    });
  }

  return violations;
}