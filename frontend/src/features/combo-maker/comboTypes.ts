import type { Card } from "../../types/card";
import type { StepFieldChanges } from "./fieldTypes";

export const ACTION_PRESETS = [
  "Normal Summon",
  "Special Summon",
  "Set",
  "Activate Effect",
  "Activate from Hand",
  "Flip Summon",
  "Tribute",
  "Sent to GY",
  "Banished",
  "Return to Hand",
  "Custom",
] as const;
export type ActionPreset = (typeof ACTION_PRESETS)[number];

export const INSTRUCTION_PRESETS = [
  "Activate Effect",
  "Tribute for Summon",
  "Normal Summon",
  "Special Summon",
  "Set",
  "Target",
  "Send to GY (Cost)",
  "Discard (Cost)",
  "Chain Link",
  "Add to Hand",
  "Draw",
  "Material",
  "Custom",
] as const;
export type InstructionPreset = (typeof INSTRUCTION_PRESETS)[number];

export interface ComboStep {
  id: string;
  card: Card;
  action: ActionPreset;
  customActionText?: string;
  instructionToNext?: InstructionPreset;
  customInstructionText?: string;
  notes?: string;
  fieldChanges?: StepFieldChanges;
}

// for line break in combo area
export const LINE_BREAK = "line-break" as const;
export type ComboEntry = ComboStep | typeof LINE_BREAK;