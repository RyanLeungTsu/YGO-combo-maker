import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type { ComboStep } from "../comboTypes";
import type { ZoneId } from "../fieldTypes";

interface ComboStore {
  steps: ComboStep[];
  addStep: (card: Card) => void;
  removeStep: (stepId: string) => void;
  updateStepAction: (
    stepId: string,
    action: string,
    customText?: string,
  ) => void;
  reorderSteps: (stepIdA: string, stepIdB: string) => void;
  updateStepInstruction: (
    stepId: string,
    instruction: string,
    customText?: string,
  ) => void;
  updateStepNotes: (stepId: string, notes: string) => void;
  clearCombo: () => void;
  setStepPlacement: (stepId: string, zone: ZoneId, cardId: number) => void;
  clearStepPlacement: (stepId: string, zone: ZoneId) => void;
  toggleStepVacate: (stepId: string, zone: ZoneId) => void;
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

      reorderSteps: (stepIdA, stepIdB) => {
        set((state) => {
          if (stepIdA === stepIdB) return state;
          const indexA = state.steps.findIndex((s) => s.id === stepIdA);
          const indexB = state.steps.findIndex((s) => s.id === stepIdB);
          if (indexA === -1 || indexB === -1) return state;

          const updated = [...state.steps];
          [updated[indexA], updated[indexB]] = [
            updated[indexB],
            updated[indexA],
          ];
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
      // field editing
      setStepPlacement: (stepId, zone, cardId) => {
        set((state) => ({
          steps: state.steps.map((s) => {
            if (s.id !== stepId) return s;
            const existing =
              s.fieldChanges?.placements?.filter((p) => p.zone !== zone) ?? [];
            return {
              ...s,
              fieldChanges: {
                ...s.fieldChanges,
                placements: [...existing, { zone, cardId }],
              },
            };
          }),
        }));
      },

      clearStepPlacement: (stepId, zone) => {
        set((state) => ({
          steps: state.steps.map((s) => {
            if (s.id !== stepId) return s;
            const placements =
              s.fieldChanges?.placements?.filter((p) => p.zone !== zone) ?? [];
            return { ...s, fieldChanges: { ...s.fieldChanges, placements } };
          }),
        }));
      },

      toggleStepVacate: (stepId, zone) => {
        set((state) => ({
          steps: state.steps.map((s) => {
            if (s.id !== stepId) return s;
            const current = s.fieldChanges?.vacates ?? [];
            const vacates = current.includes(zone)
              ? current.filter((z) => z !== zone)
              : [...current, zone];
            return { ...s, fieldChanges: { ...s.fieldChanges, vacates } };
          }),
        }));
      },
    }),
    { name: "ygo-combo-storage" },
  ),
);
