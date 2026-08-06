import { useDeckStore } from "../hooks/useDeckStore";
import { useDeckValidation } from "../hooks/useDeckValidation";
import { DeckMakerArea } from "./deckMakerArea";
import { RuleWarning } from "./ruleWarning";
// import { DeckStatsPanel } from "./deckStatsPanel";
import { DeckImportExportModal } from "./deckImportExportModal";

export function DeckBuilderPanel() {
  const { main, extra, side, removeCard, clearDeck } = useDeckStore();
  const deck = { main, extra, side };
  const { violations } = useDeckValidation(deck);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button onClick={clearDeck}>Clear Deck</button>
      </div>

      <DeckImportExportModal />
      <RuleWarning violations={violations} />

      <DeckMakerArea label="Main Deck" zone="main" cards={main} onRemove={removeCard} />
      <DeckMakerArea label="Extra Deck" zone="extra" cards={extra} onRemove={removeCard} />
      <DeckMakerArea label="Side Deck" zone="side" cards={side} onRemove={removeCard} />
    </div>
  );
}