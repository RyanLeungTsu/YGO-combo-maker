import { useMemo } from "react";
import type { DeckState } from "../deckTypes";
import { validateDeck } from "../validators";

export function useDeckValidation(deck: DeckState) {
  const violations = useMemo(() => validateDeck(deck), [deck]);
  return { violations, isLegal: violations.length === 0 };
}