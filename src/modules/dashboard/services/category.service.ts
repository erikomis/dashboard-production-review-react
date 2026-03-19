import { api } from "@/shared/services/api";

export const CategoryService = {
  list: async () => {
    const response = await api.request({
      method: "GET",
      url: "/category/list",
    });
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.request({
      method: "POST",
      url: "/category/create",
      data,
    });
    return response.data;
  },

  update: async (data: { id: string; name: string; description?: string }) => {
    const response = await api.request({
      method: "PUT",
      params: { id: data.id },
      url: "/category/update",
      data,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.request({
      method: "DELETE",
      params: { id },
      url: "/category/delete",
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.request({
      method: "GET",
      params: { id },
      url: "/category/get",
    });
    return response.data;
  },
};
