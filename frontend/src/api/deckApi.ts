import type { DeckState } from "../features/deck-builder/deckTypes";
import { useAuthStore } from "../store/authStore";

const API_BASE = "http://localhost:8000";

export interface RemoteDeck extends DeckState {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRemoteDecks(): Promise<RemoteDeck[]> {
  const res = await fetch(`${API_BASE}/api/decks`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch decks");
  return res.json();
}

export async function createRemoteDeck(name: string, deck: DeckState): Promise<RemoteDeck> {
  const res = await fetch(`${API_BASE}/api/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, ...deck }),
  });
  if (!res.ok) throw new Error("Failed to create deck");
  return res.json();
}

export async function updateRemoteDeck(id: number, name: string, deck: DeckState): Promise<RemoteDeck> {
  const res = await fetch(`${API_BASE}/api/decks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, ...deck }),
  });
  if (!res.ok) throw new Error("Failed to update deck");
  return res.json();
}

export async function deleteRemoteDeck(id: number): Promise<void> {
  await fetch(`${API_BASE}/api/decks/${id}`, { method: "DELETE" });
}