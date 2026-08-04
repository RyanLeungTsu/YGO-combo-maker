import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { Card } from "../../../types/card";
import type { DeckMakerAreaName } from "../deckTypes";

interface DraggableDeckCardProps {
  card: Card;
  zone: DeckMakerAreaName;
  index: number;
  onRemove: (card: Card, zone: DeckMakerAreaName) => void;
}

function DraggableDeckCard({
  card,
  zone,
  index,
  onRemove,
}: DraggableDeckCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `deck-${zone}-${card.id}-${index}`,
    data: { card, fromZone: zone }, 
  });

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={card.card_images[0]?.image_url_small}
      alt={card.name}
      title={`${card.name} — right-click or double-click to remove`}
      onDoubleClick={() => onRemove(card, zone)}
      onContextMenu={(e) => {
        e.preventDefault(); 
        onRemove(card, zone);
      }}
      style={{
        width: "100%",
        borderRadius: 4,
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
      }}
    />
  );
}

interface DeckMakerAreaProps {
  label: string;
  zone: DeckMakerAreaName;
  cards: Card[];
  onRemove: (card: Card, zone: DeckMakerAreaName) => void;
}

export function DeckMakerArea({
  label,
  zone,
  cards,
  onRemove,
}: DeckMakerAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zone}`,
    data: { zone },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        marginBottom: 16,
        padding: 8,
        borderRadius: 6,
        background: isOver ? "rgba(80,160,255,0.15)" : "transparent",
        border: isOver ? "2px dashed #50a0ff" : "2px dashed transparent",
      }}
    >
      <h3>
        {label} ({cards.length})
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          gap: 6,
        }}
      >
        {cards.map((card, i) => (
          <DraggableDeckCard
            key={`${card.id}-${i}`}
            card={card}
            zone={zone}
            index={i}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
