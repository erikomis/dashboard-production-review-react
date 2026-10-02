import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReviewService } from "@/modules/dashboard/services/review.service";

export const useQueryReviews = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["reviews", "list", page, size],
    queryFn: () => ReviewService.list(page, size),
    placeholderData: keepPreviousData,
  });

export const useQueryReviewById = (id?: string) =>
  useQuery({
    queryKey: ["reviews", "detail", id],
    queryFn: () => ReviewService.getById(id!),
    enabled: !!id,
    staleTime: 0,
  });
