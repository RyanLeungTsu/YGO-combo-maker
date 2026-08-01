import type { Card } from "../../../types/card";

interface CardItemProps {
  card: Card;
  onClick: (card: Card) => void;
}

export function CardItem({ card, onClick }: CardItemProps) {
  return (
    <div
      onClick={() => onClick(card)}
      style={{ cursor: "pointer", textAlign: "center" }}
    >
      <img
        src={card.card_images[0]?.image_url_small}
        alt={card.name}
        loading="lazy"
        style={{ width: "100%", borderRadius: 6 }}
      />
      <p style={{ fontSize: 12, margin: "4px 0" }}>{card.name}</p>
    </div>
  );
}