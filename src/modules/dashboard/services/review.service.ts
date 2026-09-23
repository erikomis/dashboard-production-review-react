import { api } from "@/shared/services/api";
import { Review } from "@/shared/types/review";

export const ReviewService = {
  list: async (page = 0, size = 10) => {
    const response = await api.request<{ content: Review[]; totalPages: number; totalElements: number; number: number; size: number }>({
      method: "GET",
      url: `/review/list?page=${page}&size=${size}`,
    });
    return response.data;
  },

  create: async (data: {
    title: string;
    content: string;
    rating: number;
    productId: string;
  }) => {
    const response = await api.request<Review>({
      method: "POST",
      url: "/review/create",
      data,
    });
    return response.data;
  },

  update: async (data: {
    id: string;
    title: string;
    content: string;
    rating: number;
    productId: string;
  }) => {
    const response = await api.request<Review>({
      method: "PUT",
      params: { id: data.id },
      url: "/review/update",
      data,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.request({
      method: "DELETE",
      params: { id },
      url: "/review/delete",
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.request<Review>({
      method: "GET",
      params: { id },
      url: "/review/get",
    });
    return response.data;
  },
};
