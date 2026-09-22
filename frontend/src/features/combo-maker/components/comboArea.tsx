import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useComboStore } from "../hooks/useComboStore";
import { ComboStepCard } from "./comboStepCard";
import { ComboConnector } from "./comboConnector";
import { EndBoard } from "./endBoard";
import { useUserComboStore } from "../hooks/useUserComboStore";
import { useDeckStore } from "../../deck-builder/hooks/useDeckStore";
import { useEndBoardStore } from "../hooks/useEndBoardStore";
import { LINE_BREAK } from "../comboTypes";
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
  const { steps, addBreak } = useComboStore();
  const { setNodeRef, isOver } = useDroppable({ id: "combo-canvas" });
  // rowRef anchors the overlay's coordinate system, cardRefs tracks rendered card's DOM node to measure position
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [connectors, setConnectors] = useState<ConnectorPosition[]>([]);

  const userCombos = useUserComboStore((s) => s.userCombos);
  const addUserCombo = useUserComboStore((s) => s.addUserCombo);
  const { main, extra, side } = useDeckStore();
  const board = useEndBoardStore((s) => s.board);
  const extraZones = useEndBoardStore((s) => s.extraZones);
  const endBoardNotes = useEndBoardStore((s) => s.notes);
  const [nameInput, setNameInput] = useState("");
  const [includeDeck, setIncludeDeck] = useState(true);
  const [includeEndBoard, setIncludeEndBoard] = useState(true);

  const realStepCount = steps.filter((s) => s !== LINE_BREAK).length;

  // for generating a combo name (defaultly)
  function getNextDefaultName() {
    let n = 1;
    while (userCombos.some((c) => c.name === `Combo ${n}`)) n++;
    return `Combo ${n}`;
  }

  function handleSave() {
    if (realStepCount === 0) return;
    const name = nameInput.trim() || getNextDefaultName();
    if (userCombos.some((c) => c.name === name)) {
      alert(`A combo named "${name}" already exists. Choose a different name.`);
      return;
    }
    addUserCombo(
      name,
      steps,
      includeDeck ? { main, extra, side } : undefined,
      includeEndBoard ? { board, extraZones, notes: endBoardNotes } : undefined,
    );
    setNameInput("");

    const newest = useUserComboStore.getState().userCombos.at(-1);
    if (newest) {
      useUserComboStore.getState().syncComboToBackend(newest.id);
    }
  }

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
      const current = steps[i];
      const nextEntry = steps[i + 1];
      if (current === LINE_BREAK || nextEntry === LINE_BREAK) continue;

      const a = cardRefs.current.get(current.id);
      const b = cardRefs.current.get(nextEntry.id);
      if (!a || !b) continue;

      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      // draws connectors on same row
      if (Math.abs(aRect.top - bRect.top) > 4) continue;

      next.push({
        stepId: current.id,
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
    <div>
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 8,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Combo name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ flex: 1, fontSize: 12 }}
        />
        <label
          style={{
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={includeDeck}
            onChange={(e) => setIncludeDeck(e.target.checked)}
          />
          Link deck
        </label>
        <label
          style={{
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={includeEndBoard}
            onChange={(e) => setIncludeEndBoard(e.target.checked)}
          />
          Include End Board
        </label>
        <button onClick={handleSave} disabled={realStepCount === 0}>
          Save Combo
        </button>
      </div>

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
        {steps.map((entry, i) => {
          if (entry === LINE_BREAK) {
            return <div key={`break-${i}`} className="combo-break-spacer" />;
          }
          return (
            <ComboStepCard
              key={entry.id}
              ref={setCardRef(entry.id)}
              step={entry}
              stepIndex={i}
            />
          );
        })}

        {steps.length > 0 && steps[steps.length - 1] === LINE_BREAK && (
          <div
            className="combo-break-marker"
            title="Next card will start here"
          />
        )}

        <button onClick={addBreak} className="combo-new-row-btn">
          + New Row
        </button>

        <div className="connector-overlay">
          {connectors.map((c) => {
            const step = steps.find(
              (s) => s !== LINE_BREAK && s.id === c.stepId,
            );
            if (!step || step === LINE_BREAK) return null;
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

      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
          End Board
        </p>
        <EndBoard />
      </div>
    </div>
  );
}
