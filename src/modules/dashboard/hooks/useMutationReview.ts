import { useMutation } from "@tanstack/react-query";
import { ReviewService } from "@/modules/dashboard/services/review.service";
import { queryClient } from "@/shared/libs/react-query";

type ReviewCreatePayload = { title: string; content: string; rating: number; productId: string };
type ReviewUpdatePayload = { id: string; title: string; content: string; rating: number; productId: string };

export const useMutationReview = () =>
  useMutation({
    mutationFn: (review: ReviewCreatePayload) => ReviewService.create(review),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

export const useMutationUpdateReview = () =>
  useMutation({
    mutationFn: (review: ReviewUpdatePayload) => ReviewService.update(review),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });

export const useMutationDeleteReview = () =>
  useMutation({
    mutationFn: (id: string) => ReviewService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
