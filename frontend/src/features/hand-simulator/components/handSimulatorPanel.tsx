import { useDeckStore } from "../../deck-builder/hooks/useDeckStore";
import { useShuffledDeck } from "../hooks/useDeckShuffle";
import { useUiStore } from "../../../store/uiStore";
import { ProbabilityCalculator } from "./probabilityCalculator";

export function HandSimulatorPanel() {
  const main = useDeckStore((s) => s.main);
  const openPreview = useUiStore((s) => s.openPreview);
  const { hand, redraw } = useShuffledDeck(main);

  if (main.length === 0) {
    return <p style={{ fontSize: 12, opacity: 0.6 }}>Add cards to your Main Deck to test hands.</p>;
  }

  return (
    <div>
      <button onClick={redraw} style={{ marginBottom: 12 }}>Draw</button>

      {hand.length > 0 && (
        <>
          <p style={{ fontSize: 12 }}>Hand ({hand.length})</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 6 }}>
            {hand.map((card, i) => (
              <img
                key={`${card.id}-${i}`}
                src={card.card_images[0]?.image_url_small}
                alt={card.name}
                onClick={() => openPreview(card)}
                style={{ width: "100%", borderRadius: 4, cursor: "pointer" }}
              />
            ))}
          </div>
        </>
      )}

      <ProbabilityCalculator deckSize={main.length} />
    </div>
  );
}