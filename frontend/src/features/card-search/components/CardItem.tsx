import { useDraggable } from "@dnd-kit/core";
import type { Card } from "../../../types/card";
import { useDeckStore } from "../../deck-builder/hooks/useDeckStore";
import { useUiStore } from "../../../store/uiStore";

export function CardItem({ card }: { card: Card }) {
  const addCard = useDeckStore((state) => state.addCard);
  const openPreview = useUiStore((state) => state.openPreview);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `search-${card.id}`,
    data: { card },
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ textAlign: "center", opacity: isDragging ? 0.4 : 1, cursor: "grab" }}>
      <img
        src={card.card_images[0]?.image_url_small}
        alt={card.name}
        loading="lazy"
        title={`${card.name} — click to preview, double-click or right-click to add to deck`}
        onClick={() => openPreview(card)}
        onDoubleClick={() => addCard(card)}
        onContextMenu={(e) => {
          e.preventDefault();
          addCard(card);
        }}
        style={{ width: "100%", borderRadius: 6, pointerEvents: isDragging ? "none" : "auto" }}
      />
      <p style={{ fontSize: 12, margin: "4px 0" }}>{card.name}</p>
    </div>
  );
}