import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationCategory } from "@/modules/dashboard/hooks/useMutationCategory";
import { useSlugField } from "@/modules/dashboard/hooks/useSlugField";
import { getErrorMessage } from "@/shared/utils/error-message";
import { SchemaCreateCategory } from "./create-category.schema";
import { CreateCategoryValues } from "./create-category.type";

export const useCreateCategoryModel = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationCategory();

  const form = useForm<CreateCategoryValues>({
    resolver: zodResolver(SchemaCreateCategory),
    defaultValues: { name: "", slug: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const { nameField, slugField, regenerateSlug } = useSlugField(form);

  const onSubmit: SubmitHandler<CreateCategoryValues> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success("Categoria criada com sucesso!");
      navigate("/dashboard/categories");
    } catch (error) {
      // ex.: 409 "Categorie already exists"
      toast.error(getErrorMessage(error, "Erro ao criar categoria. Tente novamente."));
    }
  };

  return {
    nameField,
    slugField,
    descriptionField: register("description"),
    regenerateSlug,
    errors,
    isPending,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/categories"),
  };
};
