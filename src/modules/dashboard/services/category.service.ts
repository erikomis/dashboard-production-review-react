import { api } from "@/shared/services/api";
import { Category, CategoryPayload } from "@/shared/types/category";

type Id = number | string;

export const CategoryService = {
  /** GET /category/list — lista completa, com `subCategories` aninhadas. */
  list: async () => {
    const response = await api.request<Category[]>({
      method: "GET",
      url: "/category/list",
    });
    return response.data;
  },

  /** POST /category/ (a barra final é obrigatória). */
  create: async (data: CategoryPayload) => {
    const response = await api.request<Category>({
      method: "POST",
      url: "/category/",
      data,
    });
    return response.data;
  },

  update: async ({ id, ...data }: CategoryPayload & { id: Id }) => {
    const response = await api.request<Category>({
      method: "PUT",
      url: `/category/${id}`,
      data,
    });
    return response.data;
  },

  /** 409 se a categoria ainda tiver subcategorias. */
  delete: async (id: Id) => {
    await api.request({
      method: "DELETE",
      url: `/category/${id}`,
    });
  },

  getById: async (id: Id) => {
    const response = await api.request<Category>({
      method: "GET",
      url: `/category/${id}`,
    });
    return response.data;
  },
};
