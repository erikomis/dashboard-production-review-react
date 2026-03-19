import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "@/modules/dashboard/services/category.service";
import { queryClient } from "@/shared/libs/react-query";

type CategoryCreatePayload = { name: string; description?: string };
type CategoryUpdatePayload = { id: string; name: string; description?: string };

export const useMutationCategory = () =>
  useMutation({
    mutationFn: (category: CategoryCreatePayload) => CategoryService.create(category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

export const useMutationUpdateCategory = () =>
  useMutation({
    mutationFn: (category: CategoryUpdatePayload) => CategoryService.update(category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

export const useMutationDeleteCategory = () =>
  useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
