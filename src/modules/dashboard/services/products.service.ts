import { api } from "@/shared/services/api";
import { Product, ProductPage } from "@/shared/types/product";

export const ProductsService = {
  fetchProducts: async (page = 0, size = 10) => {
    const response = await api.request<ProductPage>({
      method: "GET",
      url: `/production/list?page=${page}&size=${size}`,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.request<Product>({
      method: "GET",
      params: { id },
      url: "/production/get",
    });
    return response.data;
  },

  create: async (data: { name: string; description: string }) => {
    const response = await api.request<Product>({
      method: "POST",
      url: "/production/create",
      data,
    });
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.request<Product>({
      method: "PUT",
      params: { id },
      url: "/production/update",
      data,
    });
    return response.data;
  },

  delete: async (id: string) => {
    await api.request({
      method: "DELETE",
      params: { id },
      url: "/production/delete",
    });
  },
};
