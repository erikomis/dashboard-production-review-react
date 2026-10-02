import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  AdminReviewParams,
  AdminReviewsService,
} from "@/modules/dashboard/services/admin-reviews.service";
import { queryClient } from "@/shared/libs/react-query";
import { ModerationPayload } from "@/shared/types/review";

// Fica sob "reviews": o SSE e as mutations de avaliação já invalidam essa chave.
export const useQueryAdminReviews = (params: AdminReviewParams) =>
  useQuery({
    queryKey: ["reviews", "admin", params],
    queryFn: () => AdminReviewsService.list(params),
    placeholderData: keepPreviousData,
  });

/** Ocultar/restaurar muda notas e contagens: invalida avaliações, produtos e estatísticas. */
export const useMutationModerateReview = () =>
  useMutation({
    mutationFn: ({ id, ...data }: ModerationPayload & { id: number }) =>
      AdminReviewsService.moderate(id, data),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
      ]),
  });
