import { api } from "@/shared/services/api";
import { ModerationPayload, Review, ReviewPage, ReviewStatus } from "@/shared/types/review";

export type AdminReviewParams = {
  page?: number;
  size?: number;
  status?: ReviewStatus;
  note?: number;
  productId?: number;
  search?: string;
};

/** Moderação (ADMIN): lista todas as avaliações, inclusive ocultas. */
export const AdminReviewsService = {
  /** GET /admin/reviews — mais recentes primeiro; `search` em título/descrição. */
  list: async ({ page = 0, size = 10, status, note, productId, search }: AdminReviewParams = {}) => {
    const response = await api.request<ReviewPage>({
      method: "GET",
      url: "/admin/reviews",
      params: {
        page,
        size,
        status,
        note: note || undefined,
        productId: productId || undefined,
        search: search?.trim() || undefined,
      },
    });
    return response.data;
  },

  /** PATCH /admin/reviews/{id}/moderation — `reason` obrigatório (≤ 255) ao ocultar. */
  moderate: async (id: number, data: ModerationPayload) => {
    const response = await api.request<Review>({
      method: "PATCH",
      url: `/admin/reviews/${id}/moderation`,
      data,
    });
    return response.data;
  },
};
