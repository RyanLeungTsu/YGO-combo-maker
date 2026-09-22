export interface BanlistEntry {
  cardId: number;
  name: string;
  status: "Banned" | "Limited" | "Semi-Limited";
}

const API_BASE = "http://localhost:8000";

export async function getBanlist(format: string): Promise<BanlistEntry[]> {
  const res = await fetch(`${API_BASE}/api/banlist/current?format=${format}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.entries;
}
