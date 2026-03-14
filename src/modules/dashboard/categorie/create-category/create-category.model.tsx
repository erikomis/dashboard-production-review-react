import { useNavigate } from "react-router-dom";
import { CreateCategorie } from "./create-category.type";
import { CreateCategorySchema } from "./create-category.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CategoryService } from "../../services/category.service";
import { useMutationCategory } from "../../hooks/category/useMutationCategory";

type CreateCategorieServiceProps = typeof CategoryService.create;

export const useCreateCategoryModel = (
  CreateCategorieService: CreateCategorieServiceProps
) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategorie>({
    resolver: zodResolver(CreateCategorySchema),
  });

  const { mutate } = useMutationCategory(CreateCategorieService);
  const onSubmit = async (data: CreateCategorie) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Categoria criada com sucesso!");
        navigate("/dashboard/categories");
      },
      onError: (er) => {
        const message =
          (er as AxiosError<{ message: string }>)?.response?.data?.message ||
          (er as Error).message;
        toast.error(message);
      },
    });
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
  };
};
