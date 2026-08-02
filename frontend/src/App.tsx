import { useState } from "react";
import { useCardSearch } from "./features/card-search/hooks/useCardSearch";
import { useCardFilters } from "./features/card-search/hooks/useCardFilters";
import { SearchBar } from "./features/card-search/components/Searchbar";
import { FilterUI } from "./features/card-search/components/FilterUI";
import { CardGrid } from "./features/card-search/components/CardGrid";
import type { Card } from "./types/card";
import './App.css'

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { filters, setFilter, clearFilter, clearAll } = useCardFilters({ name: "" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useCardSearch(filters);

  const allCards = data?.pages.flatMap((page) => page.cards) ?? [];

return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1>Yu-Gi-Oh Card Search</h1>

      <SearchBar
        value={filters.name ?? ""}
        onChange={(value) => setFilter("name", value || undefined)}
      />

      <FilterUI
        filters={filters}
        onSetFilter={setFilter}
        onClearFilter={clearFilter}
        onClearAll={clearAll}
      />

      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading cards.</p>}

      <CardGrid
        cards={allCards}
        onCardClick={setSelectedCard}
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />

      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img src={selectedCard.card_images[0]?.image_url} alt={selectedCard.name} style={{ maxHeight: "80vh" }} />
        </div>
      )}
    </div>
  );
}

export default App;