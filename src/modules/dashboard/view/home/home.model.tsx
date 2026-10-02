import { useSearchParams } from "react-router-dom";
import { useQueryAdminStats } from "@/modules/dashboard/hooks/useQueryAdminStats";
import { useQueryReviews } from "@/modules/dashboard/hooks/useQueryReviews";
import {
  chartTheme,
  PERIOD_OPTIONS,
  peakDay,
  sumCounts,
  toRatingBuckets,
  weightedAverage,
} from "@/modules/dashboard/utils/chart-data";
import useColorMode from "@/shared/hooks/useColorMode";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { homePeriodSchema } from "./home.schema";
import { HomePeriod } from "./home.type";

const RECENT_COUNT = 5;

export const useHomeModel = () => {
  const { data: user } = useMeQuery();
  const [colorMode] = useColorMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const days = homePeriodSchema.parse(searchParams.get("days") ?? undefined) as HomePeriod;

  const setDays = (value: HomePeriod) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 30) next.delete("days");
        else next.set("days", String(value));
        return next;
      },
      { replace: true }
    );

  const stats = useQueryAdminStats(days);
  const reviews = useQueryReviews(0, RECENT_COUNT);

  const data = stats.data;
  const reviewsPerDay = data?.reviewsPerDay ?? [];
  const usersPerDay = data?.usersPerDay ?? [];
  const reviewsInPeriod = sumCounts(reviewsPerDay);
  const usersInPeriod = sumCounts(usersPerDay);

  return {
    userName: user?.name,
    days,
    setDays,
    periodOptions: PERIOD_OPTIONS.map((value) => ({ value, label: `${value} dias` })),
    theme: chartTheme(colorMode),
    totals: data?.totals,
    averageNote: data && data.totals.reviews > 0 ? data.averageNote : null,
    ratingBuckets: toRatingBuckets(data?.ratingDistribution),
    reviewsPerDay,
    usersPerDay,
    reviewsInPeriod,
    usersInPeriod,
    averageInPeriod: weightedAverage(reviewsPerDay),
    reviewsPeak: peakDay(reviewsPerDay),
    usersPeak: peakDay(usersPerDay),
    topProducts: (data?.topProducts ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      value: p.totalReviews,
      averageNote: p.averageNote,
      to: `/dashboard/products/${p.id}`,
    })),
    topCategories: (data?.topCategories ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      value: c.totalReviews,
      averageNote: c.averageNote,
      to: `/dashboard/categories/${c.id}`,
    })),
    isLoadingStats: stats.isLoading,
    isRefreshingStats: stats.isFetching && !stats.isLoading,
    isStatsError: stats.isError,
    refetchStats: () => void stats.refetch(),
    recentReviews: reviews.data?.content ?? [],
    isLoadingReviews: reviews.isLoading,
    isReviewsError: reviews.isError,
    refetchReviews: () => void reviews.refetch(),
  };
};
