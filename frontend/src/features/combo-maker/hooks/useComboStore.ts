import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type { ComboStep } from "../comboTypes";

interface ComboStore {
  steps: ComboStep[];
  addStep: (card: Card) => void;
  removeStep: (stepId: string) => void;
  updateStepAction: (
    stepId: string,
    action: string,
    customText?: string,
  ) => void;
  moveStep: (stepId: string, direction: "left" | "right") => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  updateStepInstruction: (
    stepId: string,
    instruction: string,
    customText?: string,
  ) => void;
  updateStepNotes: (stepId: string, notes: string) => void;
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
              ? {
                  ...s,
                  action: action as ComboStep["action"],
                  customActionText: customText,
                }
              : s,
          ),
        }));
      },

      moveStep: (stepId, direction) => {
        set((state) => {
          const index = state.steps.findIndex((s) => s.id === stepId);
          if (index === -1) return state;

          const targetIndex = direction === "left" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.steps.length)
            return state; // already at an edge

          const updated = [...state.steps];
          [updated[index], updated[targetIndex]] = [
            updated[targetIndex],
            updated[index],
          ]; // swap
          return { steps: updated };
        });
      },

      reorderSteps: (fromIndex, toIndex) => {
        set((state) => {
          if (fromIndex === toIndex) return state;
          const updated = [...state.steps];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return { steps: updated };
        });
      },

      updateStepInstruction: (stepId, instruction, customText) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId
              ? {
                  ...s,
                  instructionToNext:
                    instruction as ComboStep["instructionToNext"],
                  customInstructionText: customText,
                }
              : s,
          ),
        }));
      },

      updateStepNotes: (stepId, notes) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s.id === stepId ? { ...s, notes } : s,
          ),
        }));
      },

      clearCombo: () => set({ steps: [] }),
    }),
    { name: "ygo-combo-storage" },
  ),
);
