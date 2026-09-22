import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserCombo, ComboEntry } from "../comboTypes";
import type { DeckState } from "../../deck-builder/deckTypes";
import type { EndBoardState } from "../fieldTypes";
import { createRemoteCombo } from "../../../api/comboApi";

interface UserComboStore {
  userCombos: UserCombo[];
  addUserCombo: (
    name: string,
    steps: ComboEntry[],
    linkedDeck?: DeckState,
    linkedEndBoard?: EndBoardState
  ) => void;
  renameUserCombo: (id: string, name: string) => void;
  deleteUserCombo: (id: string) => void;
  importUserCombo: (combo: Omit<UserCombo, "id" | "savedAt">) => void;
  syncedIds: Record<string, number>; 
  syncComboToBackend: (localId: string) => Promise<void>;
}

let comboIdCounter = 0;
const newId = () => `usercombo-${Date.now()}-${comboIdCounter++}`;

export const useUserComboStore = create<UserComboStore>()(
  persist(
    (set, get) => ({
      userCombos: [],

      addUserCombo: (name, steps, linkedDeck, linkedEndBoard) =>
        set((state) => ({
          userCombos: [
            ...state.userCombos,
            { id: newId(), name, steps, linkedDeck, linkedEndBoard, savedAt: Date.now() },
          ],
        })),

      renameUserCombo: (id, name) =>
        set((state) => ({
          userCombos: state.userCombos.map((c) => (c.id === id ? { ...c, name } : c)),
        })),

      deleteUserCombo: (id) =>
        set((state) => ({ userCombos: state.userCombos.filter((c) => c.id !== id) })),

      importUserCombo: (combo) =>
        set((state) => ({
          userCombos: [...state.userCombos, { ...combo, id: newId(), savedAt: Date.now() }],
        })),

        syncedIds: {},

      syncComboToBackend: async (localId) => {
        const combo = get().userCombos.find((c) => c.id === localId);
        if (!combo) return;
        try {
          const remote = await createRemoteCombo(combo.name, combo.steps, combo.linkedDeck, combo.linkedEndBoard);
          set((state) => ({ syncedIds: { ...state.syncedIds, [localId]: remote.id } }));
        } catch {
          // 
        }
      },
    }),

    
    { name: "ygo-user-combos-storage" }
  )
);