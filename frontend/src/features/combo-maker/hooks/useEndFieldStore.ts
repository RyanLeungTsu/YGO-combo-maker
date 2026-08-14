import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type { ZoneId } from "../fieldTypes";

interface EndFieldStore {
  board: Record<string, Card>;
  setCard: (zone: ZoneId, card: Card) => void;
  clearZone: (zone: ZoneId) => void;
  clearAll: () => void;
}

export const useEndFieldStore = create<EndFieldStore>()(
  persist(
    (set) => ({
      board: {},
      setCard: (zone, card) =>
        set((state) => ({ board: { ...state.board, [zone]: card } })),
      clearZone: (zone) =>
        set((state) => {
          const board = { ...state.board };
          delete board[zone];
          return { board };
        }),
      clearAll: () => set({ board: {} }),
    }),
    { name: "ygo-endfield-storage" },
  ),
);
