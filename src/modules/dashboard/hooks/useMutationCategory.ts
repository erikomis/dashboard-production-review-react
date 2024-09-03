import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";
import { queryClient } from "../../../shared/libs/react-query";

export const useMutationCategory = () =>
  useMutation({
    mutationFn: (category) => CategoryService.create(category),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),
  });
