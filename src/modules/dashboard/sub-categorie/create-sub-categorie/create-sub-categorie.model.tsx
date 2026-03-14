import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CreateSubCategorieCategorieSchema } from "./create-sub-categorie.schema";
import { CreateSubCategorie } from "./create-sub-categorie.type";
import { SubCategorieService } from "../../services/sub-category.service";

type CreateSubCategorieServiceProps = typeof SubCategorieService.create;

export const useCreateCategorieModel = (
  CreateSubCategorieService: CreateSubCategorieServiceProps
) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubCategorie>({
    resolver: zodResolver(CreateSubCategorieCategorieSchema),
  });

  const onSubmit = async (data: CreateSubCategorie) => {
    console.log(data, "data");

    try {
      const response = await CreateSubCategorieService({
        categorieId: data.categorieId,
        description: data.description,
        name: data.name,
        slug: data.slug,
      });

      if (response.status === 201) {
        toast.success("Categoria criada com sucesso!");
        navigate("/dashboard/categorie");
      }
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      toast.error(error.message);
    }
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
  };
};
