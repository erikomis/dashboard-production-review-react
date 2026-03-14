import { useMutation } from "@tanstack/react-query";
import { CategoryService } from "../../services/category.service";
import { queryClient } from "../../../../shared/libs/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useMutationDeleteCatetory = (
  DeleteCategoryService: typeof CategoryService.delete
) =>
  useMutation({
    mutationFn: DeleteCategoryService,
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
