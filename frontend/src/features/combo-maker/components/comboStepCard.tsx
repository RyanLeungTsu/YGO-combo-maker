import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ComboStep } from "../comboTypes";
import { ACTION_PRESETS } from "../comboTypes";
import { useComboStore } from "../hooks/useComboStore";
import { useUiStore } from "../../../store/uiStore";

export function ComboStepCard({ step, stepNumber }: { step: ComboStep; stepNumber: number }) {
  const updateStepAction = useComboStore((s) => s.updateStepAction);
  const updateStepNotes = useComboStore((s) => s.updateStepNotes);
  const removeStep = useComboStore((s) => s.removeStep);
  const openPreview = useUiStore((s) => s.openPreview);
  const [customText, setCustomText] = useState(step.customActionText ?? "");
  const [notes, setNotes] = useState(step.notes ?? "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        background: "#1e1e1e",
        border: "1px solid #444",
        borderRadius: 8,
        padding: 8,
        paddingTop: 20,
        width: 140,
        flexShrink: 0,
      }}
    >
      <div
        {...attributes}
        {...listeners}
        title="Drag to reorder"
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

      <select
        value={step.action}
        onChange={(e) => updateStepAction(step.id, e.target.value, customText)}
        style={{ width: "100%", fontSize: 11 }}
      >
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
}