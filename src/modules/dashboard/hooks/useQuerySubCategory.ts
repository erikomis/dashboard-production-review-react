import { useQuery } from "@tanstack/react-query";
import { SubCategoryService } from "@/modules/dashboard/services/sub-category.service";

export const useQuerySubCategory = () =>
  useQuery({
    queryKey: ["sub-categories"],
    queryFn: () => SubCategoryService.list(),
  });

export const useQuerySubCategoryById = (id?: string) =>
  useQuery({
    queryKey: ["sub-categories", "detail", id],
    queryFn: () => SubCategoryService.getById(id!),
    enabled: !!id,
    staleTime: 0,
  });
