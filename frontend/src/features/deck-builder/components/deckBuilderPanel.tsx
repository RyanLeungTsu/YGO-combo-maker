import { useDeckStore } from "../hooks/useDeckStore";
import { useDeckValidation } from "../hooks/useDeckValidation";
import { DeckMakerArea } from "./deckMakerArea";
import { RuleWarning } from "./ruleWarning";

export function DeckBuilderPanel() {
  const { main, extra, side, removeCard, clearDeck } = useDeckStore();
  const { violations } = useDeckValidation({ main, extra, side });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Deck Builder</h2>
        <button onClick={clearDeck}>Clear Deck</button>
      </div>

      <RuleWarning violations={violations} />

      <DeckMakerArea label="Main Deck" zone="main" cards={main} onRemove={removeCard} />
      <DeckMakerArea label="Extra Deck" zone="extra" cards={extra} onRemove={removeCard} />
      <DeckMakerArea label="Side Deck" zone="side" cards={side} onRemove={removeCard} />
    </div>
  );
}