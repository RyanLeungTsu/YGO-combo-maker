import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type {
  ZoneId,
  PlacedCard,
  CardOrientation,
  ExtraBoardZone,
} from "../fieldTypes";

interface EndBoardStore {
  board: Record<string, PlacedCard>;
  extraZones: Record<ExtraBoardZone, Card[]>;
  setCard: (zone: ZoneId, card: Card) => void;
  moveCard: (fromZone: ZoneId, toZone: ZoneId) => void;
  setOrientation: (zone: ZoneId, orientation: CardOrientation) => void;
  clearZone: (zone: ZoneId) => void;
  addXyzMaterial: (zone: ZoneId, card: Card) => void;
  removeXyzMaterial: (zone: ZoneId, index: number) => void;
  addToExtraZone: (zone: ExtraBoardZone, card: Card) => void;
  removeFromExtraZone: (zone: ExtraBoardZone, index: number) => void;
  clearAll: () => void;
}

export const useEndBoardStore = create<EndBoardStore>()(
  persist(
    (set) => ({
      board: {},
      extraZones: { gy: [], banished: [], hand: [] },

      setCard: (zone, card) =>
        set((state) => ({
          board: { ...state.board, [zone]: { card, orientation: "face-up" } },
        })),

      moveCard: (fromZone, toZone) =>
        set((state) => {
          if (fromZone === toZone) return state;

          const source = state.board[fromZone];
          if (!source) return state;

          const target = state.board[toZone];
          const board = { ...state.board };

          if (target) {
            board[fromZone] = target;
            board[toZone] = source;
          } else {
            delete board[fromZone];
            board[toZone] = source;
          }

          return { board };
        }),

      setOrientation: (zone, orientation) =>
        set((state) => {
          const existing = state.board[zone];
          if (!existing) return state;
          return {
            board: { ...state.board, [zone]: { ...existing, orientation } },
          };
        }),

      clearZone: (zone) =>
        set((state) => {
          const board = { ...state.board };
          delete board[zone];
          return { board };
        }),

      addXyzMaterial: (zone, card) =>
        set((state) => {
          const existing = state.board[zone];
          if (!existing) return state;
          return {
            board: {
              ...state.board,
              [zone]: {
                ...existing,
                materials: [...(existing.materials ?? []), card],
              },
            },
          };
        }),

      removeXyzMaterial: (zone, index) =>
        set((state) => {
          const existing = state.board[zone];
          if (!existing) return state;
          return {
            board: {
              ...state.board,
              [zone]: {
                ...existing,
                materials: (existing.materials ?? []).filter(
                  (_, i) => i !== index,
                ),
              },
            },
          };
        }),

      addToExtraZone: (zone, card) =>
        set((state) => ({
          extraZones: {
            ...state.extraZones,
            [zone]: [...state.extraZones[zone], card],
          },
        })),

      removeFromExtraZone: (zone, index) =>
        set((state) => ({
          extraZones: {
            ...state.extraZones,
            [zone]: state.extraZones[zone].filter((_, i) => i !== index),
          },
        })),

      clearAll: () =>
        set({ board: {}, extraZones: { gy: [], banished: [], hand: [] } }),
    }),
    { name: "ygo-endboard-storage" },
  ),
);
