import { useQuery } from "@tanstack/react-query";
import { SubCategoryService } from "@/modules/dashboard/services/sub-category.service";

export const useQuerySubCategory = () =>
  useQuery({
    queryKey: ["sub-categories"],
    queryFn: () => SubCategoryService.list(),
  });
