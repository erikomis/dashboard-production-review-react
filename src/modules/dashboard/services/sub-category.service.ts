import { api } from "@/shared/services/api";
import { SubCategory, SubCategoryPayload } from "@/shared/types/category";

type Id = number | string;

/** Atenção à grafia da rota no backend: `/sub-categorie`. */
export const SubCategoryService = {
  list: async () => {
    const response = await api.request<SubCategory[]>({
      method: "GET",
      url: "/sub-categorie/list",
    });
    return response.data;
  },

  create: async (data: SubCategoryPayload) => {
    const response = await api.request<SubCategory>({
      method: "POST",
      url: "/sub-categorie/create",
      data,
    });
    return response.data;
  },

  update: async ({ id, ...data }: SubCategoryPayload & { id: Id }) => {
    const response = await api.request<SubCategory>({
      method: "PUT",
      url: `/sub-categorie/${id}`,
      data,
    });
    return response.data;
  },

  delete: async (id: Id) => {
    await api.request({
      method: "DELETE",
      url: `/sub-categorie/${id}`,
    });
  },

  getById: async (id: Id) => {
    const response = await api.request<SubCategory>({
      method: "GET",
      url: `/sub-categorie/${id}`,
    });
    return response.data;
  },
};
