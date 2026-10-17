import type { ComboEntry } from "../features/combo-maker/comboTypes";
import type { DeckState } from "../features/deck-builder/deckTypes";
import type { EndBoardState } from "../features/combo-maker/fieldTypes";
import { useAuthStore } from "../store/authStore";
import { API_BASE } from "../lib/apiConfig";

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

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRemoteCombos(): Promise<RemoteCombo[]> {
  const res = await fetch(`${API_BASE}/api/combos`, { headers: authHeaders() });;
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
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, steps, linked_deck: linkedDeck, linked_end_board: linkedEndBoard }),
  });
  if (!res.ok) throw new Error("Failed to create combo");
  return res.json();
}

export async function deleteRemoteCombo(id: number): Promise<void> {
  await fetch(`${API_BASE}/api/combos/${id}`, { method: "DELETE" });
}

// featured combo tab
export async function fetchFeaturedCombos(offset = 0, limit = 20): Promise<RemoteCombo[]> {
  const res = await fetch(`${API_BASE}/api/combos/featured?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch featured combos");
  return res.json();
}