import { useQuery } from "@tanstack/react-query";
import { getBanlist } from "../../../api/banlistApi";

export function useBanlist() {
  return useQuery({
    queryKey: ["banlist"],
    queryFn: getBanlist,
    staleTime: 1000 * 60 * 60,
  });
}
