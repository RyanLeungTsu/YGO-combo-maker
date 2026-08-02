import { useState } from "react";
import { useCardSearch } from "./features/card-search/hooks/useCardSearch";
import { useCardFilters } from "./features/card-search/hooks/useCardFilters";
import { SearchBar } from "./features/card-search/components/Searchbar";
import { FilterUI } from "./features/card-search/components/FilterUI";
import { CardGrid } from "./features/card-search/components/CardGrid";
import { DeckBuilderPanel } from "./features/deck-builder/components/deckBuilderPanel";
import type { Card } from "./types/card";
import './App.css'

function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { filters, setFilter, clearFilter, clearAll } = useCardFilters({ name: "dragon" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useCardSearch(filters);

  const allCards = data?.pages.flatMap((page) => page.cards) ?? [];

  return (
    <div style={{ display: "flex", gap: 24, padding: 16 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1>Card Search</h1>
        <SearchBar value={filters.name ?? ""} onChange={(v) => setFilter("name", v || undefined)} />
        <FilterUI filters={filters} onSetFilter={setFilter} onClearFilter={clearFilter} onClearAll={clearAll} />
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading cards.</p>}
        <CardGrid
          cards={allCards}
          onCardClick={setSelectedCard}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <DeckBuilderPanel />
      </div>

      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img src={selectedCard.card_images[0]?.image_url} alt={selectedCard.name} style={{ maxHeight: "80vh" }} />
        </div>
      )}
    </div>
  );
}

export default App;