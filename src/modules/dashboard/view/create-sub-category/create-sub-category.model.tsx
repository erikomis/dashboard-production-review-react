import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationSubCategory } from "@/modules/dashboard/hooks/useMutationSubCategory";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useSlugField } from "@/modules/dashboard/hooks/useSlugField";
import { getErrorMessage } from "@/shared/utils/error-message";
import { SchemaCreateSubCategory } from "./create-sub-category.schema";
import { CreateSubCategoryValues } from "./create-sub-category.type";

export const useCreateSubCategoryModel = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationSubCategory();
  const categories = useQueryCategory();

  const form = useForm<CreateSubCategoryValues>({
    resolver: zodResolver(SchemaCreateSubCategory),
    defaultValues: { name: "", slug: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const { nameField, slugField, regenerateSlug } = useSlugField(form);

  const onSubmit: SubmitHandler<CreateSubCategoryValues> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success("Subcategoria criada com sucesso!");
      navigate("/dashboard/sub-categories");
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar subcategoria. Tente novamente."));
    }
  };

  return {
    nameField,
    slugField,
    descriptionField: register("description"),
    categoryField: register("categorieId"),
    regenerateSlug,
    errors,
    isPending,
    categoryOptions: categories.data ?? [],
    isLoadingCategories: categories.isLoading,
    isCategoriesError: categories.isError,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/sub-categories"),
  };
};
