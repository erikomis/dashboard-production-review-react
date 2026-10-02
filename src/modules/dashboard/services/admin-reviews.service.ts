import { api } from "@/shared/services/api";
import { fetchCsv } from "@/shared/services/csv-export";
import {
  BulkModerationPayload,
  BulkModerationResult,
  ModerationPayload,
  Review,
  ReviewPage,
  ReviewReport,
  ReviewStatus,
} from "@/shared/types/review";

export type AdminReviewFilters = {
  status?: ReviewStatus;
  note?: number;
  productId?: number;
  search?: string;
  /** Só avaliações com denúncias abertas. */
  reported?: boolean;
};

export type AdminReviewParams = AdminReviewFilters & {
  page?: number;
  size?: number;
};

const filterParams = ({ status, note, productId, search, reported }: AdminReviewFilters) => ({
  status,
  note: note || undefined,
  productId: productId || undefined,
  search: search?.trim() || undefined,
  reported: reported || undefined,
});

/** Moderação (ADMIN): lista todas as avaliações, inclusive ocultas. */
export const AdminReviewsService = {
  /** GET /admin/reviews — mais recentes primeiro; `search` em título/descrição. */
  list: async ({ page = 0, size = 10, ...filters }: AdminReviewParams = {}) => {
    const response = await api.request<ReviewPage>({
      method: "GET",
      url: "/admin/reviews",
      params: { page, size, ...filterParams(filters) },
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

  /** PATCH /admin/reviews/moderation — até 100 ids; inexistentes são ignorados. */
  moderateMany: async (data: BulkModerationPayload) => {
    const response = await api.request<BulkModerationResult>({
      method: "PATCH",
      url: "/admin/reviews/moderation",
      data,
    });
    return response.data;
  },

  /** GET /admin/reviews/{id}/reports — denúncias abertas da avaliação. */
  listReports: async (id: number) => {
    const response = await api.request<ReviewReport[]>({
      method: "GET",
      url: `/admin/reviews/${id}/reports`,
    });
    return response.data;
  },

  /** DELETE /admin/reviews/{id}/reports — descarta as denúncias (a avaliação continua visível). */
  dismissReports: async (id: number) => {
    await api.request({ method: "DELETE", url: `/admin/reviews/${id}/reports` });
  },

  /** PUT /admin/reviews/{id}/reply — cria ou edita a resposta oficial (1 a 1000 caracteres). */
  reply: async (id: number, text: string) => {
    const response = await api.request<Review>({
      method: "PUT",
      url: `/admin/reviews/${id}/reply`,
      data: { text },
    });
    return response.data;
  },

  /** DELETE /admin/reviews/{id}/reply — idempotente. */
  deleteReply: async (id: number) => {
    await api.request({ method: "DELETE", url: `/admin/reviews/${id}/reply` });
  },

  /** DELETE /review/{id}/images/{imageId} — autor ou ADMIN. */
  deleteImage: async (reviewId: number, imageId: number) => {
    await api.request({ method: "DELETE", url: `/review/${reviewId}/images/${imageId}` });
  },

  /** GET /admin/reviews/export.csv — mesmos filtros da lista. */
  exportCsv: (filters: AdminReviewFilters) =>
    fetchCsv("/admin/reviews/export.csv", filterParams(filters), "avaliacoes"),
};
