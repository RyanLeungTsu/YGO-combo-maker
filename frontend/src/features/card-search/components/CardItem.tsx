import type { Card } from "../../../types/card";
import { useDeckStore } from "../../deck-builder/hooks/useDeckStore";

interface CardItemProps {
  card: Card;
  onClick: (card: Card) => void;
}

export function CardItem({ card, onClick }: CardItemProps) {
  const addCard = useDeckStore((state) => state.addCard);

  return (
    <div style={{ cursor: "pointer", textAlign: "center", position: "relative" }}>
      <img
        src={card.card_images[0]?.image_url_small}
        alt={card.name}
        loading="lazy"
        onClick={() => onClick(card)}
        style={{ width: "100%", borderRadius: 6 }}
      />
      <p style={{ fontSize: 12, margin: "4px 0" }}>{card.name}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addCard(card);
        }}
        style={{ fontSize: 11, padding: "2px 6px" }}
      >
        + Add to Deck
      </button>
    </div>
  );
}