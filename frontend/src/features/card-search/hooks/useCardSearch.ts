import { useInfiniteQuery } from "@tanstack/react-query";
import { searchCards } from "../../../api/cardsApi";
import type { CardSearchFilters } from "../../../types/card";

export function useCardSearch(filters: CardSearchFilters) {
  return useInfiniteQuery({
    queryKey: ["cardSearch", filters],
    queryFn: ({ pageParam = 0 }) => searchCards(filters, pageParam, 24),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * 24 : undefined,
    staleTime: 1000 * 60 * 60 * 24, 
  });
}