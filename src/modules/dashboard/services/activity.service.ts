import { api } from "@/shared/services/api";
import { fetchCsv } from "@/shared/services/csv-export";
import { ActivityFilters, ActivityPage, ActivitySummary } from "@/shared/types/admin";

const clean = (filters: ActivityFilters) => ({
  type: filters.type || undefined,
  entityType: filters.entityType || undefined,
  search: filters.search?.trim() || undefined,
  from: filters.from || undefined,
  to: filters.to || undefined,
});

/** Proxy da API para o serviço de logs. 503 = serviço de auditoria fora do ar. */
export const ActivityService = {
  list: async (filters: ActivityFilters & { page?: number; size?: number }) => {
    const response = await api.request<ActivityPage>({
      method: "GET",
      url: "/admin/activity",
      params: { page: filters.page ?? 0, size: filters.size ?? 20, ...clean(filters) },
    });
    return response.data;
  },

  summary: async ({ from, to }: Pick<ActivityFilters, "from" | "to">) => {
    const response = await api.request<ActivitySummary>({
      method: "GET",
      url: "/admin/activity/summary",
      params: { from: from || undefined, to: to || undefined },
    });
    return response.data;
  },

  /** GET /admin/activity/export.csv — filtros da atividade (até 10.000 linhas). */
  exportCsv: (filters: ActivityFilters) => fetchCsv("/admin/activity/export.csv", clean(filters), "atividade"),
};
