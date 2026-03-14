import { useQueryCategory } from "../../hooks/category/useQueryCategory";



export const useListCategoryModel = () => {
  const { data, isLoading } = useQueryCategory();

  return {
    data,
    isLoading,
  };
};
