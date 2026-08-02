import { create } from "zustand";
import type { Card } from "../../../types/card";
import type { DeckState, DeckMakerAreaName } from "../deckTypes";
import { EXTRA_DECK_TYPES } from "../../../lib/constants";

interface DeckStore extends DeckState {
  addCard: (card: Card, zone?: DeckMakerAreaName) => void;
  removeCard: (card: Card, zone: DeckMakerAreaName) => void;
  clearDeck: () => void;
  getZoneForCard: (card: Card) => DeckMakerAreaName;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  main: [],
  extra: [],
  side: [],

  getZoneForCard: (card) => {
    return (EXTRA_DECK_TYPES as readonly string[]).includes(card.type) ? "extra" : "main";
  },

  addCard: (card, zone) => {
    const targetZone = zone ?? get().getZoneForCard(card);
    set((state) => ({
      [targetZone]: [...state[targetZone], card],
    }));
  },

  removeCard: (card, zone) => {
    set((state) => {
      const index = state[zone].findIndex((c) => c.id === card.id);
      if (index === -1) return state;
      const updated = [...state[zone]];
      updated.splice(index, 1);
      return { [zone]: updated };
    });
  },

  clearDeck: () => set({ main: [], extra: [], side: [] }),
}));