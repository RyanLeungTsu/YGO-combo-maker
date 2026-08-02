import type { Card } from "../../../types/card";
import type { DeckMakerAreaName } from "../deckTypes";

interface DeckMakerAreaProps {
  label: string;
  zone: DeckMakerAreaName;
  cards: Card[];
  onRemove: (card: Card, zone: DeckMakerAreaName) => void;
}

export function DeckMakerArea({ label, zone, cards, onRemove }: DeckMakerAreaProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3>{label} ({cards.length})</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 6 }}>
        {cards.map((card, i) => (
          <img
            key={`${card.id}-${i}`}
            src={card.card_images[0]?.image_url_small}
            alt={card.name}
            title={`${card.name} (click to remove)`}
            onClick={() => onRemove(card, zone)}
            style={{ width: "100%", borderRadius: 4, cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}