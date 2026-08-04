import { useRef } from "react";
import { useDeckStore } from "../hooks/useDeckStore";
import { getCardsByIds } from "../../../api/cardsApi";
import { toYdk, toJson, parseYdkIds, fromJson, downloadTextFile } from "../../../lib/deck/deckSerializer";

export function DeckImportExportModal() {
  const { main, extra, side, clearDeck, addCard } = useDeckStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function exportYdk() {
    downloadTextFile("deck.ydk", toYdk({ main, extra, side }));
  }

  function exportJson() {
    downloadTextFile("deck.json", toJson({ main, extra, side }));
  }

  async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    clearDeck();

    if (file.name.endsWith(".json")) {
      const deck = fromJson(text);
      deck.main.forEach((c) => addCard(c, "main"));
      deck.extra.forEach((c) => addCard(c, "extra"));
      deck.side.forEach((c) => addCard(c, "side"));
    } else {
      // treats anything else as .ydk
      const ids = parseYdkIds(text);
      const uniqueIds = [...new Set([...ids.main, ...ids.extra, ...ids.side])];
      const cards = await getCardsByIds(uniqueIds);
      const byId = new Map(cards.map((c) => [c.id, c]));

      ids.main.forEach((id) => byId.has(id) && addCard(byId.get(id)!, "main"));
      ids.extra.forEach((id) => byId.has(id) && addCard(byId.get(id)!, "extra"));
      ids.side.forEach((id) => byId.has(id) && addCard(byId.get(id)!, "side"));
    }

    e.target.value = ""; 
  }

  return (
    <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
      <button onClick={exportYdk}>Export .ydk</button>
      <button onClick={exportJson}>Export JSON</button>
      <button onClick={() => fileInputRef.current?.click()}>Import Deck</button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".ydk,.json"
        onChange={handleFileImport}
        style={{ display: "none" }}
      />
    </div>
  );
}