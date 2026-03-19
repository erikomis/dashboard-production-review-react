import { useMutation } from "@tanstack/react-query";
import { SubCategoryService } from "@/modules/dashboard/services/sub-category.service";
import { queryClient } from "@/shared/libs/react-query";

type SubCategoryCreatePayload = { name: string; description?: string; categoryId: string };
type SubCategoryUpdatePayload = { id: string; name: string; description?: string; categoryId: string };

export const useMutationSubCategory = () =>
  useMutation({
    mutationFn: (subCategory: SubCategoryCreatePayload) => SubCategoryService.create(subCategory),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sub-categories"] }),
  });

export const useMutationUpdateSubCategory = () =>
  useMutation({
    mutationFn: (subCategory: SubCategoryUpdatePayload) => SubCategoryService.update(subCategory),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sub-categories"] }),
  });

export const useMutationDeleteSubCategory = () =>
  useMutation({
    mutationFn: (id: string) => SubCategoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sub-categories"] }),
  });
