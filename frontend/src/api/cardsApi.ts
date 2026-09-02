import type {
  Card,
  CardSearchFilters,
  CardSearchResponse,
} from "../types/card";

const BASE_URL = "http://localhost:8000/api/cards/search";

export async function searchCards(
  filters: CardSearchFilters,
  offset = 0,
  num = 24,
): Promise<{ cards: Card[]; hasMore: boolean }> {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.type) params.set("type", filters.type);
  if (filters.attribute) params.set("attribute", filters.attribute);
  if (filters.level) params.set("level", String(filters.level));
  if (filters.atk) params.set("atk", String(filters.atk));
  if (filters.def) params.set("def", String(filters.def));
  if (filters.archetype) params.set("archetype", filters.archetype);
  params.set("num", String(num));
  params.set("offset", String(offset));

  const res = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!res.ok) {
    // // if returns 400 with no results for some filter combos, treat as empty
    // if (res.status === 400) return { cards: [], hasMore: false };
    throw new Error(`Card search failed: ${res.status}`);
  }

  return res.json();

  // const json: CardSearchResponse = await res.json();
  // return {
  //   cards: json.data,
  //   hasMore: json.data.length === num,
  // };
}

// for fetching card archetypes
export async function getArchetypes(): Promise<string[]> {
  const res = await fetch("https://db.ygoprodeck.com/api/v7/archetypes.php");
  if (!res.ok) throw new Error(`Archetype fetch failed: ${res.status}`);
  const json: { archetype_name: string }[] = await res.json();
  return json.map((a) => a.archetype_name).sort();
}

// lookup for .ydk
export async function getCardsByIds(ids: number[]): Promise<Card[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({ ids: ids.join(",") });
  const res = await fetch(`http://localhost:8000/api/cards/by-ids?${params.toString()}`);
  if (!res.ok) return [];
  const json: CardSearchResponse = await res.json();
  return json.data;
}
