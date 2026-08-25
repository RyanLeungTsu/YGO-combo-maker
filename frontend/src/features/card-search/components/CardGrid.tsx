import type { Card } from "../../../types/card";
import { CardItem } from "./CardItem";
import { useInfiniteScrollTrigger } from "../hooks/useInfiniteScroll";

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
  const sentinelRef = useInfiniteScrollTrigger(
    onLoadMore,
    hasNextPage && !isFetchingNextPage,
  );

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: 8,
        }}
      >
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
      {isFetchingNextPage && (
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            opacity: 0.6,
            marginTop: 8,
          }}
        >
          Loading more...
        </p>
      )}
    </div>
  );
}
