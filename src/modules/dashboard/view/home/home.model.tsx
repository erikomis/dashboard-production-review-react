import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useQuerySubCategory } from "@/modules/dashboard/hooks/useQuerySubCategory";
import { useQueryReviews } from "@/modules/dashboard/hooks/useQueryReviews";
import { useMeQuery } from "@/shared/hooks/useMeQuery";

/** Quantas avaliações recentes usar para a média e a distribuição de notas. */
const REVIEW_SAMPLE = 100;
const RECENT_COUNT = 5;

export const useHomeModel = () => {
  const { data: user } = useMeQuery();
  // size=1: só precisamos de page.totalElements
  const products = useQueryProducts({ page: 0, size: 1 });
  const categories = useQueryCategory();
  const subCategories = useQuerySubCategory();
  const reviews = useQueryReviews(0, REVIEW_SAMPLE);

  const totalProducts = products.data?.page.totalElements;
  const totalReviews = reviews.data?.page.totalElements;
  const totalCategories = categories.data?.length;
  const totalSubCategories = subCategories.data?.length;

  const sample = reviews.data?.content ?? [];
  const recentReviews = sample.slice(0, RECENT_COUNT);
  const avgRating =
    sample.length > 0 ? sample.reduce((acc, r) => acc + r.note, 0) / sample.length : null;

  const distribution = [5, 4, 3, 2, 1].map((note) => {
    const count = sample.filter((r) => r.note === note).length;
    return { note, count, percent: sample.length ? Math.round((count / sample.length) * 100) : 0 };
  });

  const isSampleTruncated = (totalReviews ?? 0) > sample.length;

  const refetchReviews = () => reviews.refetch();

  return {
    userName: user?.name,
    totalProducts,
    totalCategories,
    totalSubCategories,
    totalReviews,
    isLoadingProducts: products.isLoading,
    isLoadingCategories: categories.isLoading,
    isLoadingSubCategories: subCategories.isLoading,
    isLoadingReviews: reviews.isLoading,
    isReviewsError: reviews.isError,
    refetchReviews,
    avgRating,
    sampleSize: sample.length,
    isSampleTruncated,
    distribution,
    recentReviews,
  };
};
