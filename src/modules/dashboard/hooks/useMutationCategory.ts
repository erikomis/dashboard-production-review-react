import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "@/modules/dashboard/services/category.service";
import { queryClient } from "@/shared/libs/react-query";
import { CategoryPayload } from "@/shared/types/category";

type CategoryUpdatePayload = CategoryPayload & { id: number | string };

const invalidate = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

export const useMutationCategory = () =>
  useMutation({
    mutationFn: (category: CategoryPayload) => CategoryService.create(category),
    onSuccess: invalidate,
  });

export const useMutationUpdateCategory = () =>
  useMutation({
    mutationFn: (category: CategoryUpdatePayload) => CategoryService.update(category),
    onSuccess: invalidate,
  });

export const useMutationDeleteCategory = () =>
  useMutation({
    mutationFn: (id: number | string) => CategoryService.delete(id),
    onSuccess: invalidate,
  });
