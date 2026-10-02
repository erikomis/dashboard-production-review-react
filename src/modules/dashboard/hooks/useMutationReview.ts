import { useMutation } from "@tanstack/react-query";
import { ReviewService } from "@/modules/dashboard/services/review.service";
import { queryClient } from "@/shared/libs/react-query";
import { ReviewPayload } from "@/shared/types/review";

type ReviewUpdatePayload = ReviewPayload & { id: number | string };

const invalidate = () => queryClient.invalidateQueries({ queryKey: ["reviews"] });

export const useMutationReview = () =>
  useMutation({
    mutationFn: (review: ReviewPayload) => ReviewService.create(review),
    onSuccess: invalidate,
  });

export const useMutationUpdateReview = () =>
  useMutation({
    mutationFn: (review: ReviewUpdatePayload) => ReviewService.update(review),
    onSuccess: invalidate,
  });

export const useMutationDeleteReview = () =>
  useMutation({
    mutationFn: (id: number | string) => ReviewService.delete(id),
    onSuccess: invalidate,
  });
