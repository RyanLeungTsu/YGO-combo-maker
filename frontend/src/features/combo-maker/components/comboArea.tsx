import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useComboStore } from "../hooks/useComboStore";
import { ComboStepCard } from "./comboStepCard";
import { ComboConnector } from "./comboConnector";
import "../../../styles/comboArea.css";

// for the connectors in flexbox
interface ConnectorPosition {
  stepId: string;
  x: number;
  y: number;
  leftLegX: number;
  rightLegX: number;
}

export function ComboArea() {
  const { steps } = useComboStore();
  const { setNodeRef, isOver } = useDroppable({ id: "combo-canvas" });
  // rowRef anchors the overlay's coordinate system, cardRefs tracks rendered card's DOM node to measure position
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [connectors, setConnectors] = useState<ConnectorPosition[]>([]);
  // registers and unregisters card nodes as they mount and unmount
  const setCardRef = (stepId: string) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(stepId, el);
    else cardRefs.current.delete(stepId);
  };
  // positions connectors between adjacent steps, skipping steps on different rows
  const measure = () => {
    const row = rowRef.current;
    if (!row) return;
    const rowRect = row.getBoundingClientRect();
    const next: ConnectorPosition[] = [];

    for (let i = 0; i < steps.length - 1; i++) {
      const a = cardRefs.current.get(steps[i].id);
      const b = cardRefs.current.get(steps[i + 1].id);
      if (!a || !b) continue;

      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      // draws connectors on same row
      if (Math.abs(aRect.top - bRect.top) > 4) continue;

      next.push({
        stepId: steps[i].id,
        x: (aRect.right + bRect.left) / 2 - rowRect.left,
        y: aRect.top - rowRect.top,
        leftLegX: aRect.right - rowRect.left,
        rightLegX: bRect.left - rowRect.left,
      });
    }
    setConnectors(next);
  };
  // for remeasure when combo has cards/steps in it
  useLayoutEffect(() => {
    measure();
  }, [steps]);
  // for remeasuring container size change
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(row);
    return () => observer.disconnect();
  }, [steps]);

  return (
    <div
      ref={(el) => {
        rowRef.current = el;
        setNodeRef(el);
      }}
      className={`combo-row ${isOver ? "combo-row--active" : ""}`}
    >
      {/* state for no steps */}
      {steps.length === 0 && <div className="combo-empty-slot">+</div>}
      {/* for flex, wrap/size determined by cards */}
      {steps.map((step, i) => (
        <ComboStepCard
          key={step.id}
          ref={setCardRef(step.id)}
          step={step}
          stepNumber={i + 1}
        />
      ))}

      <div className="connector-overlay">
        {connectors.map((c) => {
          const step = steps.find((s) => s.id === c.stepId);
          if (!step) return null;
          return (
            <div key={c.stepId}>
              <div
                className="connector-leg"
                style={{ left: c.leftLegX, top: c.y, height: 10 }}
              />
              <div
                className="connector-leg"
                style={{ left: c.rightLegX, top: c.y, height: 10 }}
              />
              <ComboConnector step={step} x={c.x} y={c.y} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
