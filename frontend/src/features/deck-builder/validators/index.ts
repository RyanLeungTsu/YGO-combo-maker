import { checkDeckSize } from "./deckSizeRule";
import { checkCardLimits } from "./cardLimitRule";
import { checkBanlist } from "../../banlist/validators/banlistRules";
import type { DeckState, Violation } from "../../deck-builder/deckTypes";
import type { BanlistEntry } from "../../../api/banlistApi";

export function validateDeck(
  deck: DeckState,
  banlist: BanlistEntry[] = [],
): Violation[] {
  return [
    ...checkDeckSize(deck),
    ...checkCardLimits(deck),
    ...checkBanlist(deck, banlist),
  ];
}
