import { useQuery } from "@tanstack/react-query";
import { ReviewService } from "@/modules/dashboard/services/review.service";

export const useQueryReviews = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["reviews", page, size],
    queryFn: () => ReviewService.list(page, size),
  });
