import { useMemo } from "react";
import type { DeckState } from "../../deck-builder/deckTypes";
import { validateDeck } from "../validators";
import { useBanlist } from "../../banlist/hooks/useBanlist";

export function useDeckValidation(deck: DeckState) {
  const { data: banlist = [] } = useBanlist();
  const violations = useMemo(
    () => validateDeck(deck, banlist),
    [deck, banlist],
  );
  return { violations, isLegal: violations.length === 0 };
}
