import { create } from "zustand";
import type { Card } from "../../../types/card";
import type { DeckState, DeckMakerAreaName } from "../deckTypes";
import { EXTRA_DECK_TYPES } from "../../../lib/constants";

interface DeckStore extends DeckState {
  addCard: (card: Card, zone?: DeckMakerAreaName) => void;
  removeCard: (card: Card, zone: DeckMakerAreaName) => void;
  moveCard: (
    card: Card,
    fromZone: DeckMakerAreaName,
    toZone: DeckMakerAreaName,
  ) => void;
  clearDeck: () => void;
  getZoneForCard: (card: Card) => DeckMakerAreaName;
  isValidZoneForCard: (card: Card, zone: DeckMakerAreaName) => boolean;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  main: [],
  extra: [],
  side: [],

  getZoneForCard: (card) => {
    return (EXTRA_DECK_TYPES as readonly string[]).includes(card.type)
      ? "extra"
      : "main";
  },

  // side deck holds anything, but main/extra are restricted by card type
  isValidZoneForCard: (card, zone) => {
    const isExtraType = (EXTRA_DECK_TYPES as readonly string[]).includes(
      card.type,
    );
    if (zone === "main") return !isExtraType;
    if (zone === "extra") return isExtraType;
    return true; 
  },

  addCard: (card, zone) => {
    const targetZone = zone ?? get().getZoneForCard(card);
    if (!get().isValidZoneForCard(card, targetZone)) return; 
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

  moveCard: (card, fromZone, toZone) => {
    if (fromZone === toZone) return;
    if (!get().isValidZoneForCard(card, toZone)) return; 

    set((state) => {
      const sourceIndex = state[fromZone].findIndex((c) => c.id === card.id);
      if (sourceIndex === -1) return state;

      const source = [...state[fromZone]];
      source.splice(sourceIndex, 1);
      const target = [...state[toZone], card];

      return { [fromZone]: source, [toZone]: target };
    });
  },

  clearDeck: () => set({ main: [], extra: [], side: [] }),
}));