import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SubCategoryService } from "@/modules/dashboard/services/sub-category.service";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useMutationUpdateSubCategory } from "@/modules/dashboard/hooks/useMutationSubCategory";
import { SchemaEditSubCategory } from "./edit-sub-category.schema";
import { EditSubCategoryValues } from "./edit-sub-category.type";
import { Category } from "@/shared/types/category";

export const useEditSubCategoryModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: categories } = useQueryCategory();
  const { mutateAsync: updateSubCategory, isPending } = useMutationUpdateSubCategory();

  const { data, isLoading } = useQuery({
    queryKey: ["sub-categories", id],
    queryFn: () => SubCategoryService.getById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSubCategoryValues>({
    resolver: zodResolver(SchemaEditSubCategory),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        description: data.description ?? "",
        categoryId: data.categoryId ?? data.category?.id ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<EditSubCategoryValues> = async (formData) => {
    try {
      await updateSubCategory({ id: id!, ...formData });
      toast.success("Subcategoria atualizada com sucesso!");
      navigate("/dashboard/sub-categories");
    } catch {
      toast.error("Erro ao atualizar subcategoria. Tente novamente.");
    }
  };

  const categoryOptions: Category[] = Array.isArray(categories) ? categories : [];

  return {
    register,
    handleSubmit,
    errors,
    isPending,
    isLoading,
    onSubmit,
    navigate,
    categoryOptions,
  };
};
