import { api } from "@/shared/services/api";

export const SubCategoryService = {
  list: async () => {
    const response = await api.request({
      method: "GET",
      url: "/sub-category/list",
    });
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    categoryId: string;
  }) => {
    const response = await api.request({
      method: "POST",
      url: "/sub-category/create",
      data,
    });
    return response.data;
  },

  update: async (data: {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
  }) => {
    const response = await api.request({
      method: "PUT",
      params: { id: data.id },
      url: "/sub-category/update",
      data,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.request({
      method: "DELETE",
      params: { id },
      url: "/sub-category/delete",
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.request({
      method: "GET",
      params: { id },
      url: "/sub-category/get",
    });
    return response.data;
  },
};
