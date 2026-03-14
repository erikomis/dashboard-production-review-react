import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";
import { queryClient } from "../../../shared/libs/react-query";

type CategoryPayload = { name: string; description?: string };

export const useMutationCategory = () =>
  useMutation({
    mutationFn: (category: CategoryPayload) => CategoryService.create(category),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),
  });
