import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  AdminReviewParams,
  AdminReviewsService,
} from "@/modules/dashboard/services/admin-reviews.service";
import { queryClient } from "@/shared/libs/react-query";
import { BulkModerationPayload, ModerationPayload } from "@/shared/types/review";

// Fica sob "reviews": o SSE e as mutations de avaliação já invalidam essa chave.
export const useQueryAdminReviews = (params: AdminReviewParams, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: ["reviews", "admin", params],
    queryFn: () => AdminReviewsService.list(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });

/** Denúncias abertas de uma avaliação (painel lateral). */
export const useQueryReviewReports = (reviewId: number | null) =>
  useQuery({
    queryKey: ["reviews", "reports", reviewId],
    queryFn: () => AdminReviewsService.listReports(reviewId!),
    enabled: reviewId !== null,
    staleTime: 0,
  });

/** Ocultar/restaurar muda notas e contagens: invalida avaliações, produtos e estatísticas. */
const invalidateModeration = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["reviews"] }),
    queryClient.invalidateQueries({ queryKey: ["products"] }),
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
  ]);

export const useMutationModerateReview = () =>
  useMutation({
    mutationFn: ({ id, ...data }: ModerationPayload & { id: number }) =>
      AdminReviewsService.moderate(id, data),
    onSuccess: invalidateModeration,
  });

export const useMutationModerateReviews = () =>
  useMutation({
    mutationFn: (data: BulkModerationPayload) => AdminReviewsService.moderateMany(data),
    onSuccess: invalidateModeration,
  });

export const useMutationDismissReports = () =>
  useMutation({
    mutationFn: (reviewId: number) => AdminReviewsService.dismissReports(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

export const useMutationReplyReview = () =>
  useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) => AdminReviewsService.reply(id, text),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

export const useMutationDeleteReply = () =>
  useMutation({
    mutationFn: (id: number) => AdminReviewsService.deleteReply(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

export const useMutationDeleteReviewImage = () =>
  useMutation({
    mutationFn: ({ reviewId, imageId }: { reviewId: number; imageId: number }) =>
      AdminReviewsService.deleteImage(reviewId, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
