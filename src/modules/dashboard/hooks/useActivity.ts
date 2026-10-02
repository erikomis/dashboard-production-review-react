import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ActivityService } from "@/modules/dashboard/services/activity.service";
import { ActivityFilters } from "@/shared/types/admin";
import { getErrorStatus } from "@/shared/utils/error-message";

/** 503 = serviço de auditoria fora do ar: não adianta repetir automaticamente. */
const retry = (failureCount: number, error: unknown) => {
  const status = getErrorStatus(error);
  if (status === 503 || status === 400 || status === 403) return false;
  return failureCount < 1;
};

export const useQueryActivity = (filters: ActivityFilters & { page: number; size: number }) =>
  useQuery({
    queryKey: ["activity", "list", filters],
    queryFn: () => ActivityService.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
    retry,
  });

export const useQueryActivitySummary = (from?: string, to?: string) =>
  useQuery({
    queryKey: ["activity", "summary", from ?? "", to ?? ""],
    queryFn: () => ActivityService.summary({ from, to }),
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
    retry,
  });
