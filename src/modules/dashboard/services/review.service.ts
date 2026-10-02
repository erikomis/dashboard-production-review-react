import { api } from "@/shared/services/api";
import { Review, ReviewPage, ReviewPayload } from "@/shared/types/review";

type Id = number | string;

export const ReviewService = {
  /** GET /review/list — paginado, mais recentes primeiro. */
  list: async (page = 0, size = 10) => {
    const response = await api.request<ReviewPage>({
      method: "GET",
      url: "/review/list",
      params: { page, size },
    });
    return response.data;
  },

  /** POST /review/ (barra final obrigatória). Autor = usuário logado. */
  create: async (data: ReviewPayload) => {
    const response = await api.request<Review>({
      method: "POST",
      url: "/review/",
      data,
    });
    return response.data;
  },

  update: async ({ id, ...data }: ReviewPayload & { id: Id }) => {
    const response = await api.request<Review>({
      method: "PUT",
      url: `/review/${id}`,
      data,
    });
    return response.data;
  },

  delete: async (id: Id) => {
    await api.request({
      method: "DELETE",
      url: `/review/${id}`,
    });
  },

  getById: async (id: Id) => {
    const response = await api.request<Review>({
      method: "GET",
      url: `/review/${id}`,
    });
    return response.data;
  },
};
