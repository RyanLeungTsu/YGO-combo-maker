import { create } from "zustand";
import type { Card } from "../types/card";

interface UiStore {
  previewCard: Card | null;
  openPreview: (card: Card) => void;
  closePreview: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  previewCard: null,
  openPreview: (card) => set({ previewCard: card }),
  closePreview: () => set({ previewCard: null }),
}));