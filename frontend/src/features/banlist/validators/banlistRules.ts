import type { DeckState, Violation } from "../../deck-builder/deckTypes";
import type { BanlistEntry } from "../../../api/banlistApi";

const STATUS_LIMITS: Record<string, number> = {
  Forbidden: 0,
  Limited: 1,
  "Semi-Limited": 2,
};

export function checkBanlist(
  deck: DeckState,
  banlist: BanlistEntry[],
): Violation[] {
  if (banlist.length === 0) return [];

  const banlistMap = new Map(banlist.map((e) => [e.cardId, e.status]));
  const allCards = [...deck.main, ...deck.extra, ...deck.side];
  const counts = new Map<number, number>();

  for (const card of allCards) {
    counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
  }

  const violations: Violation[] = [];
  for (const [cardId, count] of counts.entries()) {
    const status = banlistMap.get(cardId);
    if (!status) continue;
    const limit = STATUS_LIMITS[status];
    if (count > limit) {
      const card = allCards.find((c) => c.id === cardId)!;
      violations.push({
        rule: "banlist",
        message: `${card.name} is ${status} (max ${limit}), you have ${count}`,
        severity: "warning",
      });
    }
  }
  return violations;
}
