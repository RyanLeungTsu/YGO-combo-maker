import { forwardRef, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { ComboStep } from "../comboTypes";
import { ACTION_PRESETS } from "../comboTypes";
import { useComboStore } from "../hooks/useComboStore";
import { useUiStore } from "../../../store/uiStore";
import { ComboFieldStepEditor } from "../components/comboFieldStepEditor";

interface ComboStepCardProps {
  step: ComboStep;
  stepIndex: number;
}

export const ComboStepCard = forwardRef<HTMLDivElement, ComboStepCardProps>(
  function ComboStepCard({ step, stepIndex }, measureRef) {
    const updateStepAction = useComboStore((s) => s.updateStepAction);
    const updateStepNotes = useComboStore((s) => s.updateStepNotes);
    const removeStep = useComboStore((s) => s.removeStep);
    const openPreview = useUiStore((s) => s.openPreview);
    const [customText, setCustomText] = useState(step.customActionText ?? "");
    const [notes, setNotes] = useState(step.notes ?? "");
    const [showField, setShowField] = useState(false);

    const {
      attributes,
      listeners,
      setNodeRef: setDragRef,
      isDragging,
    } = useDraggable({
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
        style={{
          opacity: isDragging ? 0.4 : 1,
          border: isOver ? "2px solid #50a0ff" : undefined,
        }}
      >
        <div
          ref={setDragRef}
          {...attributes}
          {...listeners}
          className="step-card-draggable-zone"
        >

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeStep(step.id);
            }}
            title="Delete this step"
            className="combo-card-delete"
          >
            ×
          </button>

          <img
            src={step.card.card_images[0]?.image_url_small}
            alt={step.card.name}
            onClick={(e) => {
              e.stopPropagation();
              openPreview(step.card);
            }}
            className="combo-card-image"
          />
          <p className="combo-card-name">{step.card.name}</p>
        </div>

        <select
          value={step.action}
          onChange={(e) =>
            updateStepAction(step.id, e.target.value, customText)
          }
          className="combo-card-select"
        >
          {ACTION_PRESETS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
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
            className="combo-card-custom-input"
          />
        )}

        <button
          onClick={() => setShowField((v) => !v)}
          className="combo-card-field-toggle"
        >
          {showField ? "Hide Field ▾" : "Show Field ▸"}
        </button>

        {showField && <ComboFieldStepEditor stepIndex={stepIndex} />}

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            updateStepNotes(step.id, e.target.value);
          }}
          rows={2}
          className="combo-card-notes"
        />
      </div>
    );
  },
);
