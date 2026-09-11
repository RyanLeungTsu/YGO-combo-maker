export interface BanlistEntry {
  cardId: number;
  name: string;
  status: "Banned" | "Limited" | "Semi-Limited";
}

const API_BASE = "http://localhost:8000";

export async function getBanlist(): Promise<BanlistEntry[]> {
  const res = await fetch(`${API_BASE}/api/banlist/current`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.entries;
}
