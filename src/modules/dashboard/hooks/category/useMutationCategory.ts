import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../../services/category.service";
import { queryClient } from "../../../../shared/libs/react-query";

export const useMutationCategory = (
  CreateCategoryService: typeof CategoryService.create
) =>
  useMutation({
    mutationFn: CreateCategoryService,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),
  });
