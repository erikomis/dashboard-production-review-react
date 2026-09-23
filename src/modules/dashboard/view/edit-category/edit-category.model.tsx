import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CategoryService } from "@/modules/dashboard/services/category.service";
import { useMutationUpdateCategory } from "@/modules/dashboard/hooks/useMutationCategory";
import { SchemaEditCategory } from "./edit-category.schema";
import { EditCategoryValues } from "./edit-category.type";

export const useEditCategoryModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: updateCategory, isPending } = useMutationUpdateCategory();

  const { data, isLoading } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => CategoryService.getById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCategoryValues>({
    resolver: zodResolver(SchemaEditCategory),
  });

  useEffect(() => {
    if (data) {
      reset({ name: data.name, description: data.description ?? "" });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<EditCategoryValues> = async (formData) => {
    try {
      await updateCategory({ id: id!, ...formData });
      toast.success("Categoria atualizada com sucesso!");
      navigate("/dashboard/categories");
    } catch {
      toast.error("Erro ao atualizar categoria. Tente novamente.");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isPending,
    isLoading,
    onSubmit,
    navigate,
  };
};
