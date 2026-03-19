import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationSubCategory } from "@/modules/dashboard/hooks/useMutationSubCategory";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { SchemaCreateSubCategory } from "./create-sub-category.schema";
import { CreateSubCategoryValues } from "./create-sub-category.type";
import { Category } from "@/shared/types/category";

export const useCreateSubCategoryModel = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationSubCategory();
  const { data: categories } = useQueryCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubCategoryValues>({
    resolver: zodResolver(SchemaCreateSubCategory),
  });

  const onSubmit: SubmitHandler<CreateSubCategoryValues> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success("Subcategoria criada com sucesso!");
      navigate("/dashboard/sub-categories");
    } catch {
      toast.error("Erro ao criar subcategoria. Tente novamente.");
    }
  };

  const categoryOptions: Category[] = Array.isArray(categories) ? categories : [];

  return {
    register,
    handleSubmit,
    errors,
    isPending,
    onSubmit,
    navigate,
    categoryOptions,
  };
};
