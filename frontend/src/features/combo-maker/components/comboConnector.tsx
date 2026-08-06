import { useState } from "react";
import type { ComboStep } from "../comboTypes";
import { INSTRUCTION_PRESETS } from "../comboTypes";
import { useComboStore } from "../hooks/useComboStore";

export function ComboConnector({ step }: { step: ComboStep }) {
  const updateStepInstruction = useComboStore((s) => s.updateStepInstruction);
  const [customText, setCustomText] = useState(step.customInstructionText ?? "");
  const instruction = step.instructionToNext ?? "Activate Effect";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: "0 4px" }}>
      <div style={{ fontSize: 20, color: "#666" }}>→</div>
      <select
        value={instruction}
        onChange={(e) => updateStepInstruction(step.id, e.target.value, customText)}
        style={{ fontSize: 10, maxWidth: 90 }}
      >
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
          style={{ fontSize: 10, maxWidth: 90, marginTop: 2 }}
        />
      )}
    </div>
  );
}