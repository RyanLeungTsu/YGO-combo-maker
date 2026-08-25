// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { SavedCombo, ComboEntry } from "../comboTypes";
// import type { DeckState } from "../../deck-builder/deckTypes";

// interface SavedComboStore {
//   savedCombos: SavedCombo[];
//   saveCombo: (name: string, steps: ComboEntry[], linkedDeck?: DeckState) => void;
//   updateCombo: (id: string, steps: ComboEntry[], linkedDeck?: DeckState) => void;
//   renameCombo: (id: string, name: string) => void;
//   deleteCombo: (id: string) => void;
//   importCombo: (combo: Omit<SavedCombo, "id" | "savedAt">) => void;
// }

// let comboIdCounter = 0;
// const newId = () => `savedcombo-${Date.now()}-${comboIdCounter++}`;

// export const useSavedComboStore = create<SavedComboStore>()(
//   persist(
//     (set) => ({
//       savedCombos: [],

//       saveCombo: (name, steps, linkedDeck) =>
//         set((state) => ({
//           savedCombos: [...state.savedCombos, { id: newId(), name, steps, linkedDeck, savedAt: Date.now() }],
//         })),

//       updateCombo: (id, steps, linkedDeck) =>
//         set((state) => ({
//           savedCombos: state.savedCombos.map((c) =>
//             c.id === id ? { ...c, steps, linkedDeck, savedAt: Date.now() } : c
//           ),
//         })),

//       renameCombo: (id, name) =>
//         set((state) => ({
//           savedCombos: state.savedCombos.map((c) => (c.id === id ? { ...c, name } : c)),
//         })),

//       deleteCombo: (id) =>
//         set((state) => ({ savedCombos: state.savedCombos.filter((c) => c.id !== id) })),

//       // used for imported combo files generates a fresh id/timestamp rather than trusting whatever was in the file, avoiding collisions with existing saves
//       importCombo: (combo) =>
//         set((state) => ({
//           savedCombos: [...state.savedCombos, { ...combo, id: newId(), savedAt: Date.now() }],
//         })),
//     }),
//     { name: "ygo-saved-combos-storage" }
//   )
// );