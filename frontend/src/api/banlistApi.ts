import { API_BASE } from "../lib/apiConfig";

export interface BanlistEntry {
  cardId: number;
  name: string;
  status: "Banned" | "Limited" | "Semi-Limited";
}

export async function getBanlist(format: string): Promise<BanlistEntry[]> {
  const res = await fetch(`${API_BASE}/api/banlist/current?format=${format}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.entries;
}
