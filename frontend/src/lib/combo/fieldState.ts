import type { ComboStep } from "../../features/combo-maker/comboTypes";
import type { ZoneId } from "../../features/combo-maker/fieldTypes";
import type { Card } from "../../types/card";

export interface FieldViolation {
  stepId: string;
  zone: ZoneId;
  message: string;
}

// replays step placements and removals up to "uptoIndex" returning final board state and zone conflicts
export function computeFieldState(steps: ComboStep[], uptoIndex: number) {
  const board = new Map<ZoneId, Card>();
  const violations: FieldViolation[] = [];

  for (let i = 0; i <= uptoIndex && i < steps.length; i++) {
    const step = steps[i];
    const changes = step.fieldChanges;
    if (!changes) continue;

    // vacates then card can fill up the zone
    changes.vacates?.forEach((zone) => board.delete(zone));

    changes.placements?.forEach(({ zone, cardId }) => {
      if (board.has(zone)) {
        violations.push({
          stepId: step.id,
          zone,
          message: `${zone} is already occupied by ${board.get(zone)!.name} when step ${i + 1} tries to place a card there`,
        });
      }
      // overwrites so board reflects latest attempted state
      const card = i === -1 ? undefined : findCardPlacement(steps, i, cardId);
      if (card) board.set(zone, card);
    });
  }

  return { board, violations };
}

function findCardPlacement(
  steps: ComboStep[],
  stepIndex: number,
  cardId: number,
): Card | undefined {
  // the placed card is usually this step's own card, but can reference an earlier step's card (ex. repositioning card already in play)
  for (let i = stepIndex; i >= 0; i--) {
    if (steps[i].card.id === cardId) return steps[i].card;
  }
  return undefined;
}
