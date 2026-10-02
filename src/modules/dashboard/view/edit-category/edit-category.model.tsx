import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryCategoryById } from "@/modules/dashboard/hooks/useQueryCategory";
import { useMutationUpdateCategory } from "@/modules/dashboard/hooks/useMutationCategory";
import { useSlugField } from "@/modules/dashboard/hooks/useSlugField";
import { getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { SchemaEditCategory } from "./edit-category.schema";
import { EditCategoryValues } from "./edit-category.type";

export const useEditCategoryModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: updateCategory, isPending } = useMutationUpdateCategory();
  const { data, isLoading, isError, error, refetch } = useQueryCategoryById(id);

  const form = useForm<EditCategoryValues>({
    resolver: zodResolver(SchemaEditCategory),
    defaultValues: { name: "", slug: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const { nameField, slugField, regenerateSlug, syncSlugEdited } = useSlugField(form);

  useEffect(() => {
    if (data) {
      reset({ name: data.name, slug: data.slug ?? "", description: data.description ?? "" });
      syncSlugEdited(data.name, data.slug ?? "");
    }
  }, [data, reset, syncSlugEdited]);

  const onSubmit: SubmitHandler<EditCategoryValues> = async (formData) => {
    try {
      await updateCategory({ id: id!, ...formData });
      toast.success("Categoria atualizada com sucesso!");
      navigate("/dashboard/categories");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao atualizar categoria. Tente novamente."));
    }
  };

  const loadError = isError
    ? getErrorStatus(error) === 404
      ? { title: "Categoria não encontrada", description: "Ela pode ter sido excluída." }
      : {
          title: "Erro ao carregar a categoria",
          description: getErrorMessage(error),
          onRetry: () => void refetch(),
        }
    : null;

  return {
    categoryName: data?.name,
    nameField,
    slugField,
    descriptionField: register("description"),
    regenerateSlug,
    errors,
    isPending,
    isLoading,
    loadError,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/categories"),
  };
};
