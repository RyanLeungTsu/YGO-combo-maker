import { useUserComboStore } from "../hooks/useUserComboStore";
import { useComboStore } from "../hooks/useComboStore";
import { useDeckStore } from "../../deck-builder/hooks/useDeckStore";
import { exportCombo } from "../../../lib/combo/comboSerializer";
import { LINE_BREAK } from "../comboTypes";

export function SavedComboPanel() {
  const savedCombo = useUserComboStore((s) => s.userCombos);
  const renameCombo = useUserComboStore((s) => s.renameUserCombo);
  const deleteCombo = useUserComboStore((s) => s.deleteUserCombo);

  const loadSteps = useComboStore((s) => s.loadSteps);
  const loadDeck = useDeckStore((s) => s.loadDeck);

  function handleLoad(combo: (typeof savedCombo)[number]) {
    loadSteps(combo.steps);
    if (combo.linkedDeck) loadDeck(combo.linkedDeck);
  }

  if (savedCombo.length === 0) {
    return <p style={{ fontSize: 12, opacity: 0.6 }}>No saved combos yet — save one from the Combo Maker tab.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {savedCombo.map((combo) => {
        const stepCount = combo.steps.filter((s) => s !== LINE_BREAK).length;
        return (
          <div
            key={combo.id}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, border: "1px solid #333", borderRadius: 6, padding: 6 }}
          >
            <span style={{ flex: 1 }}>
              {combo.name} {combo.linkedDeck && <span title="Has linked deck">🔗</span>}
              <span style={{ opacity: 0.5 }}> ({stepCount} steps)</span>
            </span>
            <button onClick={() => handleLoad(combo)}>Load</button>
            <button onClick={() => exportCombo(combo)}>Export</button>
            <button
              onClick={() => {
                const newName = prompt("Rename combo:", combo.name);
                if (newName?.trim()) renameCombo(combo.id, newName.trim());
              }}
            >
              Rename
            </button>
            <button onClick={() => deleteCombo(combo.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}