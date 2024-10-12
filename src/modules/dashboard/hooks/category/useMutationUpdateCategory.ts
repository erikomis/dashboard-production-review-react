import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../../services/category.service";
import { queryClient } from "../../../../shared/libs/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useMutationUpdateCatetory = (
  UpdateCategoryService: typeof CategoryService.update
) =>
  useMutation({
    mutationFn: UpdateCategoryService,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),
    onError: (er) => {
      const message =
        (er as AxiosError<{ message: string }>)?.response?.data?.message ||
        (er as Error).message;
      toast.error(message);
    },
  });
