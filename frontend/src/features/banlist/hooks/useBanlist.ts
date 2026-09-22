import { useQuery } from "@tanstack/react-query";
import { getBanlist } from "../../../api/banlistApi";
import { useUiStore } from "../../../store/uiStore";

export function useBanlist() {
  const format = useUiStore((s) => s.banlistFormat);
  return useQuery({
    queryKey: ["banlist", format],
    queryFn: () => getBanlist(format),
    staleTime: 1000 * 60 * 60,
  });
}