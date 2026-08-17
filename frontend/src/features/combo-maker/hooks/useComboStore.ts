import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "../../../types/card";
import type { ComboEntry, ComboStep } from "../comboTypes";
import { LINE_BREAK } from "../comboTypes";
import type { ZoneId } from "../fieldTypes";

interface ComboStore {
  steps: ComboEntry[];
  addStep: (card: Card) => void;
  addBreak: () => void;
  removeStep: (stepId: string) => void;
  swapSteps: (stepIdA: string, stepIdB: string) => void;
  updateStepAction: (
    stepId: string,
    action: string,
    customText?: string,
  ) => void;
  updateStepInstruction: (
    stepId: string,
    instruction: string,
    customText?: string,
  ) => void;
  updateStepNotes: (stepId: string, notes: string) => void;
  setStepPlacement: (stepId: string, zone: ZoneId, cardId: number) => void;
  clearStepPlacement: (stepId: string, zone: ZoneId) => void;
  toggleStepVacate: (stepId: string, zone: ZoneId) => void;
  clearCombo: () => void;
}

let stepIdCounter = 0;

export const useComboStore = create<ComboStore>()(
  persist(
    (set, get) => ({
      steps: [],

      addStep: (card) => {
        const maxExisting = Math.max(
          0,
          ...get()
            .steps.filter((s): s is ComboStep => s !== LINE_BREAK)
            .map((s) => Number(s.id.replace("step-", "")) || 0),
        );
        if (stepIdCounter <= maxExisting) stepIdCounter = maxExisting + 1;

        const newStep: ComboStep = {
          id: `step-${stepIdCounter++}`,
          card,
          action: "Normal Summon",
        };
        set((state) => ({ steps: [...state.steps, newStep] }));
      },

      addBreak: () => {
        set((state) => {
          const last = state.steps[state.steps.length - 1];
          if (last === LINE_BREAK) return state;
          return { steps: [...state.steps, LINE_BREAK] };
        });
      },

      removeStep: (stepId) => {
        set((state) => ({
          steps: state.steps.filter((s) => s === LINE_BREAK || s.id !== stepId),
        }));
      },

      swapSteps: (stepIdA, stepIdB) => {
        set((state) => {
          if (stepIdA === stepIdB) return state;
          const indexA = state.steps.findIndex(
            (s) => s !== LINE_BREAK && s.id === stepIdA,
          );
          const indexB = state.steps.findIndex(
            (s) => s !== LINE_BREAK && s.id === stepIdB,
          );
          if (indexA === -1 || indexB === -1) return state;

          const updated = [...state.steps];
          [updated[indexA], updated[indexB]] = [
            updated[indexB],
            updated[indexA],
          ];
          return { steps: updated };
        });
      },

      updateStepAction: (stepId, action, customText) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s !== LINE_BREAK && s.id === stepId
              ? {
                  ...s,
                  action: action as ComboEntry extends infer T
                    ? T extends { action: infer A }
                      ? A
                      : never
                    : never,
                  customActionText: customText,
                }
              : s,
          ),
        }));
      },

      updateStepInstruction: (stepId, instruction, customText) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s !== LINE_BREAK && s.id === stepId
              ? {
                  ...s,
                  instructionToNext: instruction as never,
                  customInstructionText: customText,
                }
              : s,
          ),
        }));
      },

      updateStepNotes: (stepId, notes) => {
        set((state) => ({
          steps: state.steps.map((s) =>
            s !== LINE_BREAK && s.id === stepId ? { ...s, notes } : s,
          ),
        }));
      },

      setStepPlacement: (stepId, zone, cardId) => {
        set((state) => ({
          steps: state.steps.map((s) => {
            if (s === LINE_BREAK || s.id !== stepId) return s;
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
            if (s === LINE_BREAK || s.id !== stepId) return s;
            const placements =
              s.fieldChanges?.placements?.filter((p) => p.zone !== zone) ?? [];
            return { ...s, fieldChanges: { ...s.fieldChanges, placements } };
          }),
        }));
      },

      toggleStepVacate: (stepId, zone) => {
        set((state) => ({
          steps: state.steps.map((s) => {
            if (s === LINE_BREAK || s.id !== stepId) return s;
            const current = s.fieldChanges?.vacates ?? [];
            const vacates = current.includes(zone)
              ? current.filter((z) => z !== zone)
              : [...current, zone];
            return { ...s, fieldChanges: { ...s.fieldChanges, vacates } };
          }),
        }));
      },

      clearCombo: () => set({ steps: [] }),
    }),
    {
      name: "ygo-combo-storage",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.steps = cleanupBreaks(state.steps);
      },
    },
  ),
);

function cleanupBreaks(steps: ComboEntry[]): ComboEntry[] {
  const result: ComboEntry[] = [];
  for (const entry of steps) {
    if (entry === LINE_BREAK) {
      const prev = result[result.length - 1];
      if (result.length === 0 || prev === LINE_BREAK) continue;
      result.push(entry);
    } else {
      result.push(entry);
    }
  }
  // for trailing breaks
  if (result[result.length - 1] === LINE_BREAK) {
    result.pop();
  }
  return result;
}
