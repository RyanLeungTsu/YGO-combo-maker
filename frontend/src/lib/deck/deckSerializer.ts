import type { DeckState } from "../../features/deck-builder/deckTypes";

// .ydk is the standard format used by most YGO deck tools
export function toYdk(deck: DeckState): string {
  const lines = ["#main"];
  deck.main.forEach((c) => lines.push(String(c.id)));
  lines.push("#extra");
  deck.extra.forEach((c) => lines.push(String(c.id)));
  lines.push("!side");
  deck.side.forEach((c) => lines.push(String(c.id)));
  return lines.join("\n");
}

// Parsing .ydk gives back card IDs only, user must look up full Card objects (e.g. via the cards API) to rehydrate.
export function parseYdkIds(text: string): { main: number[]; extra: number[]; side: number[] } {
  const result = { main: [] as number[], extra: [] as number[], side: [] as number[] };
  let section: "main" | "extra" | "side" | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "#main") { section = "main"; continue; }
    if (line === "#extra") { section = "extra"; continue; }
    if (line === "!side") { section = "side"; continue; }
    if (!line || line.startsWith("#")) continue;
    const id = Number(line);
    if (section && !Number.isNaN(id)) result[section].push(id);
  }
  return result;
}

export function toJson(deck: DeckState): string {
  return JSON.stringify(deck, null, 2);
}

export function fromJson(text: string): DeckState {
  const parsed = JSON.parse(text);
  return {
    main: parsed.main ?? [],
    extra: parsed.extra ?? [],
    side: parsed.side ?? [],
  };
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}