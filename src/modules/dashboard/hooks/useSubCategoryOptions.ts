import { useQueryCategory } from "./useQueryCategory";
import { useQuerySubCategory } from "./useQuerySubCategory";

/** Dados do select de subcategoria (agrupado por categoria). */
export const useSubCategoryOptions = () => {
  const subCategories = useQuerySubCategory();
  const categories = useQueryCategory();
  return {
    subCategories: subCategories.data ?? [],
    categories: categories.data ?? [],
    isLoading: subCategories.isLoading || categories.isLoading,
    isError: subCategories.isError,
    isReady: !!subCategories.data,
  };
};
