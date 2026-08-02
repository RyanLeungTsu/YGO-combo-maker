import type { DeckState, Violation } from "../deckTypes";
import { checkDeckSize } from "./deckSizeRule";
import { checkCardLimits } from "./cardLimitRule";

export function validateDeck(deck: DeckState): Violation[] {
  return [...checkDeckSize(deck), ...checkCardLimits(deck)];
}