import { useQuery } from "@tanstack/react-query";
import { getArchetypes } from "../../../api/cardsApi";

export function useArchetypes() {
  return useQuery({
    queryKey: ["archetypes"],
    queryFn: getArchetypes,
    staleTime: 1000 * 60 * 60 * 24, 
  });
}