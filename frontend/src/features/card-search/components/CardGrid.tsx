import type { Card } from "../../../types/card";
import { CardItem } from "./CardItem";

interface CardGridProps {
  cards: Card[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function CardGrid({
  cards,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: CardGridProps) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 8,
        }}
      >
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
          style={{ marginTop: 12, width: "100%" }}
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
