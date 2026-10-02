import { api } from "@/shared/services/api";
import { ImportJob } from "@/shared/types/admin";

export const ImportService = {
  /** POST /admin/import/open-food-facts → 202 com o job; 409 se já houver um rodando. */
  startOpenFoodFacts: async (productsPerSubcategory: number) => {
    const response = await api.request<ImportJob>({
      method: "POST",
      url: "/admin/import/open-food-facts",
      data: { productsPerSubcategory },
    });
    return response.data;
  },

  getJob: async (id: string) => {
    const response = await api.request<ImportJob>({
      method: "GET",
      url: `/admin/import/jobs/${id}`,
    });
    return response.data;
  },

  /** Último job, ou `null` (204) se nunca houve importação. */
  getLatest: async () => {
    const response = await api.request<ImportJob | "">({
      method: "GET",
      url: "/admin/import/jobs/latest",
    });
    if (response.status === 204 || !response.data) return null;
    return response.data as ImportJob;
  },
};
