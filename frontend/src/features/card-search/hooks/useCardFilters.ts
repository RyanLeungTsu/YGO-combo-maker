// created for managing usestates, instead of scattering multiple seperate usestates in App.tsx to avoid clutter
import { useState, useCallback } from "react";
import type { CardSearchFilters } from "../../../types/card";

export function useCardFilters(initial: CardSearchFilters = {}) {
  const [filters, setFilters] = useState<CardSearchFilters>(initial);

  const setFilter = useCallback(
    // generic constraint for invalid keys
    <K extends keyof CardSearchFilters>(key: K, value: CardSearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilter = useCallback((key: keyof CardSearchFilters) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setFilters({}), []);

  return { filters, setFilter, clearFilter, clearAll };
}