import { useState } from "react";
import type { ComboStep } from "../comboTypes";
import { INSTRUCTION_PRESETS } from "../comboTypes";
import { useComboStore } from "../hooks/useComboStore";
import "../../../styles/comboArea.css"

export function ComboConnector({ step, x, y }: { step: ComboStep; x: number; y: number }) {
  const updateStepInstruction = useComboStore((s) => s.updateStepInstruction);
  const [customText, setCustomText] = useState(step.customInstructionText ?? "");
  const instruction = step.instructionToNext ?? "Activate Effect";

  return (
    <div className="connector-bar" style={{ left: x, top: y }}>
      <select value={instruction} onChange={(e) => updateStepInstruction(step.id, e.target.value, customText)}>
        {INSTRUCTION_PRESETS.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
      {instruction === "Custom" && (
        <input
          type="text"
          placeholder="Instruction..."
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            updateStepInstruction(step.id, instruction, e.target.value);
          }}
        />
      )}
    </div>
  );
}