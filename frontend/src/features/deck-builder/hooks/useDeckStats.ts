import { useMemo } from "react";
import type { DeckState } from "../deckTypes";
import { getTypeDistribution, getAttributeDistribution } from "../../../lib/deck/deckStats";

export function useDeckStats(deck: DeckState) {
  return useMemo(
    () => ({
      typeDistribution: getTypeDistribution(deck),
      attributeDistribution: getAttributeDistribution(deck),
    }),
    [deck]
  );
}