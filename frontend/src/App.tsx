import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Card } from "./types/card";
// UI imports
import { useUiStore } from "./store/uiStore";
import { TabGroup } from "./components/ui/tabGroup";
// card search and filtering imports
import { useCardSearch } from "./features/card-search/hooks/useCardSearch";
import { useCardFilters } from "./features/card-search/hooks/useCardFilters";
import { SearchBar } from "./features/card-search/components/Searchbar";
import { FilterUI } from "./features/card-search/components/FilterUI";
import { CardGrid } from "./features/card-search/components/CardGrid";
// deck builder imports
import { DeckBuilderPanel } from "./features/deck-builder/components/deckBuilderPanel";
import { useDeckStore } from "./features/deck-builder/hooks/useDeckStore";
import type { DeckMakerAreaName } from "./features/deck-builder/deckTypes";
import { DeckStatsPanel } from "./features/deck-builder/components/deckStatsPanel";
// combo imports
import { ComboArea } from "./features/combo-maker/components/comboArea";
import { useComboStore } from "./features/combo-maker/hooks/useComboStore";
import "./App.css";
// end baord imports
import { useEndBoardStore } from "./features/combo-maker/hooks/useEndBoardStore";
import type { ZoneId, ExtraBoardZone } from "./features/combo-maker/fieldTypes";

function App() {
  const [activeDragCard, setActiveDragCard] = useState<Card | null>(null);
  const { filters, setFilter, clearFilter, clearAll } = useCardFilters({
    name: "darklord",
  });
  const { addCard, moveCard, main, extra, side } = useDeckStore();
  const { previewCard, closePreview } = useUiStore();
  const { addStep, swapSteps, insertStep } = useComboStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useCardSearch(filters);

  const allCards = data?.pages.flatMap((page) => page.cards) ?? [];
  const deck = { main, extra, side };

  function handleDragStart(event: DragStartEvent) {
    const card = event.active.data.current?.card as Card | undefined;
    setActiveDragCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragCard(null);
    const { active, over } = event;

    const endBoardSourceZone = active.data.current?.endBoardSourceZone as
      | ZoneId
      | undefined;
    // for removing cards in end board
    if (endBoardSourceZone && !over) {
      useEndBoardStore.getState().clearZone(endBoardSourceZone);
      return;
    }

    if (!over) return;

    // Case 1: user drops a fresh card from search onto the combo area
    if (over.id === "combo-canvas") {
      const card = active.data.current?.card as Card | undefined;
      if (card) addStep(card);
      return;
    }

    // Case 2:user reorders an existing combo step (both active and over are step ids)
    const draggedStepId = active.data.current?.stepId as string | undefined;
    const targetStepId = over.data.current?.stepId as string | undefined;
    if (draggedStepId && targetStepId) {
      swapSteps(draggedStepId, targetStepId);
      return;
    }

    if (targetStepId && !draggedStepId) {
      const card = active.data.current?.card as Card | undefined;
      if (card) {
        insertStep(targetStepId, card);
        return;
      }
    }

    const xyzMaterialZone = over.data.current?.xyzMaterialZone as
      | ZoneId
      | undefined;
    if (xyzMaterialZone) {
      const card = active.data.current?.card as Card | undefined;

      if (card) {
        const endBoardStore = useEndBoardStore.getState();

        endBoardStore.addXyzMaterial(xyzMaterialZone, card);

        if (endBoardSourceZone) {
          endBoardStore.clearZone(endBoardSourceZone);
        }
      }

      return;
    }

    // end board
    const endBoardZone = over.data.current?.endBoardZone as ZoneId | undefined;
    if (endBoardZone) {
      const endBoardStore = useEndBoardStore.getState();
      const target = endBoardStore.board[endBoardZone];
      const card = active.data.current?.card as Card | undefined;

      if (target?.card.type === "XYZ Monster" && card) {
        if (endBoardSourceZone && endBoardSourceZone === endBoardZone) {
          return;
        }

        endBoardStore.addXyzMaterial(endBoardZone, card);

        if (endBoardSourceZone) {
          endBoardStore.clearZone(endBoardSourceZone);
        }

        return;
      }

      if (endBoardSourceZone) {
        // reposition a card already on the field
        endBoardStore.moveCard(endBoardSourceZone, endBoardZone);
      } else if (card) {
        endBoardStore.setCard(endBoardZone, card);
      }

      return;
    }

    const extraBoardZone = over.data.current?.extraBoardZone as
      | ExtraBoardZone
      | undefined;
    if (extraBoardZone) {
      const card = active.data.current?.card as Card | undefined;
      if (card)
        useEndBoardStore.getState().addToExtraZone(extraBoardZone, card);
      return;
    }

    // Case 3: search -> deck zone, or deck -> deck zone move
    const card = active.data.current?.card as Card | undefined;
    const fromZone = active.data.current?.fromZone as
      | DeckMakerAreaName
      | undefined;
    const toZone = over.data.current?.zone as DeckMakerAreaName | undefined;
    if (!card || !toZone) return;

    if (fromZone) {
      moveCard(card, fromZone, toZone);
    } else {
      addCard(card, toZone);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-layout">
        <div className="search-panel">
          <h1>Card Search</h1>
          <SearchBar
            value={filters.name ?? ""}
            onChange={(v) => setFilter("name", v || undefined)}
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
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>

        <div className="combo-deck-panel">
          <TabGroup
            defaultTabId="combo"
            tabs={[
              {
                id: "deck",
                label: "Deck Maker",
                content: <DeckBuilderPanel />,
              },
              { id: "combo", label: "Combo Maker", content: <ComboArea /> },
              {
                id: "stats",
                label: "Deck Stats",
                content: <DeckStatsPanel deck={deck} />,
              },
            ]}
          />
        </div>

        {previewCard && (
          <div
            onClick={closePreview}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <img
              src={previewCard.card_images[0]?.image_url}
              alt={previewCard.name}
              style={{ maxHeight: "80vh" }}
            />
          </div>
        )}
      </div>

      <DragOverlay>
        {activeDragCard && (
          <img
            src={activeDragCard.card_images[0]?.image_url_small}
            alt={activeDragCard.name}
            style={{
              width: 80,
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
