import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type { ComboStep } from "../comboTypes";

interface ComboStore {
  steps: ComboStep[];
  addStep: (card: Card) => void;
  removeStep: (stepId: string) => void;
  updateStepAction: (stepId: string, action: string, customText?: string) => void;
  updateStepInstruction: (stepId: string, instruction: string, customText?: string) => void;
  clearCombo: () => void;
}

let stepIdCounter = 0;

export const useComboStore = create<ComboStore>()(
  persist(
    (set) => ({
      steps: [],

      addStep: (card) => {
        const newStep: ComboStep = {
          id: `step-${stepIdCounter++}`,
          card,
          action: "Normal Summon",
        };
        set((state) => ({ steps: [...state.steps, newStep] }));
      },

      removeStep: (stepId) => {
        set((state) => ({ steps: state.steps.filter((s) => s.id !== stepId) }));
      },

      updateStepAction: (stepId, action, customText) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId
              ? { ...s, action: action as ComboStep["action"], customActionText: customText }
              : s
          ),
        }));
      },

      updateStepInstruction: (stepId, instruction, customText) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId
              ? { ...s, instructionToNext: instruction as ComboStep["instructionToNext"], customInstructionText: customText }
              : s
          ),
        }));
      },

      clearCombo: () => set({ steps: [] }),
    }),
    { name: "ygo-combo-storage" }
  )
);