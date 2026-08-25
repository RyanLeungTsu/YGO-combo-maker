import type { UserCombo } from "../../features/combo-maker/comboTypes";
import { downloadTextFile } from "../deck/deckSerializer";

export function exportCombo(combo: UserCombo) {
  const payload = { name: combo.name, steps: combo.steps, linkedDeck: combo.linkedDeck, linkedEndBoard: combo.linkedEndBoard };
  const filename = `${combo.name.replace(/\s+/g, "_") || "combo"}.combo.json`;
  downloadTextFile(filename, JSON.stringify(payload, null, 2));
}

export function parseComboFile(text: string): Omit<UserCombo, "id" | "savedAt"> {
  const parsed = JSON.parse(text);
  return {
    name: parsed.name ?? "Imported Combo",
    steps: parsed.steps ?? [],
    linkedDeck: parsed.linkedDeck,
    linkedEndBoard: parsed.linkedEndBoard,
  };
}