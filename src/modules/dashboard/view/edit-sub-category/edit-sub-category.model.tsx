import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuerySubCategoryById } from "@/modules/dashboard/hooks/useQuerySubCategory";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useMutationUpdateSubCategory } from "@/modules/dashboard/hooks/useMutationSubCategory";
import { useSlugField } from "@/modules/dashboard/hooks/useSlugField";
import { getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { SchemaEditSubCategory } from "./edit-sub-category.schema";
import { EditSubCategoryValues } from "./edit-sub-category.type";

export const useEditSubCategoryModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: updateSubCategory, isPending } = useMutationUpdateSubCategory();
  const { data, isLoading, isError, error, refetch } = useQuerySubCategoryById(id);
  const categories = useQueryCategory();

  const form = useForm<EditSubCategoryValues>({
    resolver: zodResolver(SchemaEditSubCategory),
    defaultValues: { name: "", slug: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const { nameField, slugField, regenerateSlug, syncSlugEdited } = useSlugField(form);

  // Espera as categorias para o <select> já ter a opção selecionável
  const categoriesReady = !!categories.data;
  useEffect(() => {
    if (data && categoriesReady) {
      reset({
        name: data.name,
        slug: data.slug ?? "",
        description: data.description ?? "",
        categorieId: data.categorieId,
      });
      syncSlugEdited(data.name, data.slug ?? "");
    }
  }, [data, categoriesReady, reset, syncSlugEdited]);

  const onSubmit: SubmitHandler<EditSubCategoryValues> = async (formData) => {
    try {
      await updateSubCategory({ id: id!, ...formData });
      toast.success("Subcategoria atualizada com sucesso!");
      navigate("/dashboard/sub-categories");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao atualizar subcategoria. Tente novamente."));
    }
  };

  const loadError = isError
    ? getErrorStatus(error) === 404
      ? { title: "Subcategoria não encontrada", description: "Ela pode ter sido excluída." }
      : {
          title: "Erro ao carregar a subcategoria",
          description: getErrorMessage(error),
          onRetry: () => void refetch(),
        }
    : null;

  return {
    subCategoryName: data?.name,
    nameField,
    slugField,
    descriptionField: register("description"),
    categoryField: register("categorieId"),
    regenerateSlug,
    errors,
    isPending,
    isLoading: isLoading || categories.isLoading,
    loadError,
    categoryOptions: categories.data ?? [],
    isLoadingCategories: categories.isLoading,
    isCategoriesError: categories.isError,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/sub-categories"),
  };
};
