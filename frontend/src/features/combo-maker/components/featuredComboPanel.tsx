import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedCombos } from "../../../api/comboApi";
import type { RemoteCombo } from "../../../api/comboApi";
import { useComboStore } from "../hooks/useComboStore";
import { useDeckStore } from "../../deck-builder/hooks/useDeckStore";
import { useEndBoardStore } from "../hooks/useEndBoardStore";
import { useUserComboStore } from "../hooks/useUserComboStore";
import { useUiStore } from "../../../store/uiStore";
import { LINE_BREAK } from "../comboTypes";

export function FeaturedComboPanel() {
  const { data: combos = [], isLoading, isError } = useQuery({
    queryKey: ["featuredCombos"],
    queryFn: () => fetchFeaturedCombos(0, 20),
    staleTime: 1000 * 60,
  });

  const loadSteps = useComboStore((s) => s.loadSteps);
  const loadDeck = useDeckStore((s) => s.loadDeck);
  const loadEndBoard = useEndBoardStore((s) => s.loadState);
  const addUserCombo = useUserComboStore((s) => s.addUserCombo);
  const setActiveTabId = useUiStore((s) => s.setActiveTabId);

  function handleLoad(combo: RemoteCombo) {
    loadSteps(combo.steps);
    if (combo.linked_deck) loadDeck(combo.linked_deck);
    if (combo.linked_end_board) loadEndBoard(combo.linked_end_board);
    setActiveTabId("combo");
  }

  function handleSaveCopy(combo: RemoteCombo) {
    addUserCombo(`${combo.name} (copy)`, combo.steps, combo.linked_deck, combo.linked_end_board);
  }

  if (isLoading) return <p style={{ fontSize: 12, opacity: 0.6 }}>Loading featured combos...</p>;
  if (isError) return <p style={{ fontSize: 12, opacity: 0.6 }}>Could not reach the server.</p>;
  if (combos.length === 0) {
    return <p style={{ fontSize: 12, opacity: 0.6 }}>No featured combos yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {combos.map((combo) => {
        const stepCount = combo.steps.filter((s) => s !== LINE_BREAK).length;
        return (
          <div
            key={combo.id}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, border: "1px solid #333", borderRadius: 6, padding: 6 }}
          >
            <span style={{ flex: 1 }}>
              {combo.name} {combo.linked_deck && <span title="Has linked deck">🔗</span>}
              <span style={{ opacity: 0.5 }}> ({stepCount} steps)</span>
            </span>
            <button onClick={() => handleLoad(combo)}>Load</button>
            <button onClick={() => handleSaveCopy(combo)}>Save copy</button>
          </div>
        );
      })}
    </div>
  );
}