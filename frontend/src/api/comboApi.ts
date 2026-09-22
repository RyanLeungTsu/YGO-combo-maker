import type { ComboEntry } from "../features/combo-maker/comboTypes";
import type { DeckState } from "../features/deck-builder/deckTypes";
import type { EndBoardState } from "../features/combo-maker/fieldTypes";

const API_BASE = "http://localhost:8000";

export interface RemoteCombo {
  id: number;
  name: string;
  steps: ComboEntry[];
  linked_deck?: DeckState;
  linked_end_board?: EndBoardState;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchRemoteCombos(): Promise<RemoteCombo[]> {
  const res = await fetch(`${API_BASE}/api/combos`);
  if (!res.ok) throw new Error("Failed to fetch combos");
  return res.json();
}

export async function createRemoteCombo(
  name: string,
  steps: ComboEntry[],
  linkedDeck?: DeckState,
  linkedEndBoard?: EndBoardState
): Promise<RemoteCombo> {
  const res = await fetch(`${API_BASE}/api/combos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, steps, linked_deck: linkedDeck, linked_end_board: linkedEndBoard }),
  });
  if (!res.ok) throw new Error("Failed to create combo");
  return res.json();
}

export async function deleteRemoteCombo(id: number): Promise<void> {
  await fetch(`${API_BASE}/api/combos/${id}`, { method: "DELETE" });
}