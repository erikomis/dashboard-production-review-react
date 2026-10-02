import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AdminStatsService } from "@/modules/dashboard/services/admin-stats.service";

export const useQueryAdminStats = (days: number) =>
  useQuery({
    queryKey: ["admin", "stats", days],
    queryFn: () => AdminStatsService.get(days),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
