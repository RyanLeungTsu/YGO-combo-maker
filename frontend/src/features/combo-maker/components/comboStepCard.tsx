import { forwardRef, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { ComboStep } from "../comboTypes";
import { ACTION_PRESETS } from "../comboTypes";
import { useComboStore } from "../hooks/useComboStore";
import { useUiStore } from "../../../store/uiStore";

interface ComboStepCardProps {
  step: ComboStep;
  stepNumber: number;
}

export const ComboStepCard = forwardRef<HTMLDivElement, ComboStepCardProps>(function ComboStepCard(
  { step, stepNumber },
  measureRef
) {
  const updateStepAction = useComboStore((s) => s.updateStepAction);
  const updateStepNotes = useComboStore((s) => s.updateStepNotes);
  const removeStep = useComboStore((s) => s.removeStep);
  const openPreview = useUiStore((s) => s.openPreview);
  const [customText, setCustomText] = useState(step.customActionText ?? "");
  const [notes, setNotes] = useState(step.notes ?? "");

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `step-${step.id}`,
    data: { stepId: step.id },
  });
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `slot-${step.id}`,
    data: { stepId: step.id },
  });

  return (
    <div
      ref={(el) => {
        setDropRef(el);
        if (typeof measureRef === "function") measureRef(el);
        else if (measureRef) measureRef.current = el;
      }}
      className="combo-step-card"
      style={{ opacity: isDragging ? 0.4 : 1, border: isOver ? "2px solid #50a0ff" : undefined }}
    >
      <div
        ref={setDragRef}
        {...attributes}
        {...listeners}
        title="Drag to swap with another step"
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16, cursor: "grab" }}
      />

      <div style={{ position: "absolute", top: -10, left: -10, background: "#5b8def", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
        {stepNumber}
      </div>

      <button
        onClick={() => removeStep(step.id)}
        title="Delete this step"
        style={{ position: "absolute", top: 2, right: 2, background: "#c0392b", color: "#fff", border: "none", borderRadius: 4, width: 18, height: 18, fontSize: 11, lineHeight: "18px", padding: 0, cursor: "pointer", zIndex: 1 }}
      >
        ×
      </button>

      <img
        src={step.card.card_images[0]?.image_url_small}
        alt={step.card.name}
        onClick={() => openPreview(step.card)}
        style={{ width: "100%", borderRadius: 4, cursor: "pointer" }}
      />
      <p style={{ fontSize: 11, margin: "4px 0", color: "#eee" }}>{step.card.name}</p>

      <select value={step.action} onChange={(e) => updateStepAction(step.id, e.target.value, customText)} style={{ width: "100%", fontSize: 11 }}>
        {ACTION_PRESETS.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {step.action === "Custom" && (
        <input
          type="text"
          placeholder="Describe action..."
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            updateStepAction(step.id, step.action, e.target.value);
          }}
          style={{ width: "100%", fontSize: 11, marginTop: 4 }}
        />
      )}

      <textarea
        placeholder="Notes..."
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          updateStepNotes(step.id, e.target.value);
        }}
        rows={2}
        style={{ width: "100%", fontSize: 11, marginTop: 6, resize: "none", fontFamily: "inherit" }}
      />
    </div>
  );
});