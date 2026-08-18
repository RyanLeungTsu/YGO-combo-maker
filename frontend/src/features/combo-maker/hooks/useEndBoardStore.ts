import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type { ZoneId, PlacedCard, CardOrientation } from "../fieldTypes";

interface EndBoardStore {
  board: Record<string, PlacedCard>;
  setCard: (zone: ZoneId, card: Card) => void;
  setOrientation: (zone: ZoneId, orientation: CardOrientation) => void;
  clearZone: (zone: ZoneId) => void;
  clearAll: () => void;
}

export const useEndBoardStore = create<EndBoardStore>()(
  persist(
    (set) => ({
      board: {},
      setCard: (zone, card) =>
        set((state) => ({ board: { ...state.board, [zone]: { card, orientation: "face-up" } } })),
      setOrientation: (zone, orientation) =>
        set((state) => {
          const existing = state.board[zone];
          if (!existing) return state;
          return { board: { ...state.board, [zone]: { ...existing, orientation } } };
        }),
      clearZone: (zone) =>
        set((state) => {
          const board = { ...state.board };
          delete board[zone];
          return { board };
        }),
      clearAll: () => set({ board: {} }),
    }),
    { name: "ygo-endboard-storage" }
  )
);
