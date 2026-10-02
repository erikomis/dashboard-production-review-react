import { api } from "@/shared/services/api";
import { AdminStats } from "@/shared/types/admin";

export const AdminStatsService = {
  /** GET /admin/stats?days= (7..365). Só avaliações visíveis entram nas médias. */
  get: async (days: number) => {
    const response = await api.request<AdminStats>({
      method: "GET",
      url: "/admin/stats",
      params: { days },
    });
    return response.data;
  },
};
