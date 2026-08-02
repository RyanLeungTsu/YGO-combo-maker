import type { Card } from "../../types/card";

export type DeckMakerAreaName = "main" | "extra" | "side";

export interface DeckState {
  main: Card[];
  extra: Card[];
  side: Card[];
}

export interface Violation {
  rule: string;
  message: string;
//   shows non-legal decks as a warning allowing for more user freedom
  severity: "warning"; 
}