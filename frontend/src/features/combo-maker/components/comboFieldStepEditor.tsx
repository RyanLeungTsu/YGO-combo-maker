import { useMemo } from "react";
import { useComboStore } from "../hooks/useComboStore";
import { FieldArea } from "./fieldArea";
import { computeFieldState } from "../../../lib/combo/fieldState";
import type { ZoneId } from "../fieldTypes";
import { ALL_ZONES } from "../fieldTypes";
import { LINE_BREAK } from "../comboTypes";

export function ComboFieldStepEditor({ stepIndex }: { stepIndex: number }) {
  const steps = useComboStore((s) => s.steps);
  const setStepPlacement = useComboStore((s) => s.setStepPlacement);
  const clearStepPlacement = useComboStore((s) => s.clearStepPlacement);
  const toggleStepVacate = useComboStore((s) => s.toggleStepVacate);

  const step = steps[stepIndex];

  const { board: boardBefore } = useMemo(
    () => computeFieldState(steps, stepIndex - 1),
    [steps, stepIndex],
  );
  const { board: boardAfter, violations } = useMemo(
    () => computeFieldState(steps, stepIndex),
    [steps, stepIndex],
  );

  if (step === LINE_BREAK) return null;

  const violatedZones = new Set(
    violations.filter((v) => v.stepId === step.id).map((v) => v.zone),
  );
  const currentPlacementZone = step.fieldChanges?.placements?.find(
    (p) => p.cardId === step.card.id,
  )?.zone;

  return (
    <div
      style={{
        marginTop: 8,
        padding: 8,
        background: "#181818",
        borderRadius: 6,
        fontSize: 11,
      }}
    >
      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
        Field (as of this step)
      </p>

      <FieldArea
        board={boardAfter}
        highlightZones={violatedZones}
        onZoneRightClick={(zone) => {
          if (boardBefore.has(zone)) toggleStepVacate(step.id, zone);
        }}
      />
      <p style={{ fontSize: 9, opacity: 0.6, margin: "4px 0 0" }}>
        Right-click an occupied zone to clear it this step.
      </p>
 
      <div style={{ marginTop: 6 }}>
        <label>
          Place this card at:{" "}
          <select
            value={currentPlacementZone ?? ""}
            onChange={(e) => {
              const zone = e.target.value as ZoneId | "";
              if (currentPlacementZone)
                clearStepPlacement(step.id, currentPlacementZone);
              if (zone) setStepPlacement(step.id, zone, step.card.id);
            }}
          >
            <option value="">None</option>
            {ALL_ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>
      </div>

      {violations
        .filter((v) => v.stepId === step.id)
        .map((v) => (
          <p key={v.zone} style={{ color: "#e74c3c", margin: "4px 0 0" }}>
            {v.message}
          </p>
        ))}
    </div>
  );
}
