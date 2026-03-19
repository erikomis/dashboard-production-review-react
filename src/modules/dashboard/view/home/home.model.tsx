import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/dashboard/services/products.service";
import { CategoryService } from "@/modules/dashboard/services/category.service";
import { SubCategoryService } from "@/modules/dashboard/services/sub-category.service";
import { ReviewService } from "@/modules/dashboard/services/review.service";
import { Review } from "@/shared/types/review";

export const useHomeModel = () => {
  const navigate = useNavigate();

  const { data: productsData } = useQuery({
    queryKey: ["products", 0, 1],
    queryFn: () => ProductsService.fetchProducts(0, 1),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  });

  const { data: subCategoriesData } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: () => SubCategoryService.list(),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", 0, 100],
    queryFn: () => ReviewService.list(0, 100),
  });

  const totalProducts = productsData?.totalElements ?? "—";
  const totalCategories = Array.isArray(categoriesData) ? categoriesData.length : "—";
  const totalSubCategories = Array.isArray(subCategoriesData) ? subCategoriesData.length : "—";
  const totalReviews = reviewsData?.totalElements ?? "—";

  const reviews: Review[] = reviewsData?.content ?? [];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  const recentReviews = reviews.slice(0, 5);

  return {
    totalProducts,
    totalCategories,
    totalSubCategories,
    totalReviews,
    avgRating,
    recentReviews,
    navigate,
  };
};
