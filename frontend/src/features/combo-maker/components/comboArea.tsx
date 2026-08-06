import { useDroppable } from "@dnd-kit/core";
import { useComboStore } from "../hooks/useComboStore";
import { ComboStepCard } from "./comboStepCard";
import { ComboConnector } from "./comboConnector";


export function ComboArea() {
  const { steps } = useComboStore();
  const { setNodeRef, isOver } = useDroppable({ id: "combo-canvas" });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: "12px 4px",
        padding: 16,
        minHeight: 220,
        border: isOver ? "2px dashed #50a0ff" : "2px dashed #333",
        borderRadius: 8,
        background: isOver ? "rgba(80,160,255,0.08)" : "transparent",
      }}
    >
      {steps.length === 0 && (
        <div
          style={{
            width: 140, height: 190,
            border: "2px dashed #555", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#555", fontSize: 28, flexShrink: 0,
          }}
        >
          +
        </div>
      )}

      {steps.map((step, i) => (
        <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
          <ComboStepCard step={step} stepNumber={i + 1} />
          {i < steps.length - 1 && <ComboConnector step={step} />}
        </div>
      ))}
    </div>
  );
}