import { api } from "@/shared/services/api";
import { DeduplicationResult } from "@/shared/types/admin";

export const CatalogService = {
  /**
   * POST /admin/catalog/deduplicate — em cada grupo de nomes iguais na mesma subcategoria,
   * mantém o mais antigo e remove os demais que não têm avaliações. Idempotente.
   */
  deduplicate: async () => {
    const response = await api.request<DeduplicationResult>({
      method: "POST",
      url: "/admin/catalog/deduplicate",
    });
    return response.data;
  },
};
