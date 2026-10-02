import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationCreateProduct } from "@/modules/dashboard/hooks/useMutationProduct";
import { useSlugField } from "@/modules/dashboard/hooks/useSlugField";
import { useSubCategoryOptions } from "@/modules/dashboard/hooks/useSubCategoryOptions";
import { getErrorMessage } from "@/shared/utils/error-message";
import { SchemaCreateProduct } from "./create-product.schema";
import { CreateProductValues } from "./create-product.type";

export const useCreateProductModel = () => {
  const navigate = useNavigate();
  const { mutateAsync: createProduct, isPending } = useMutationCreateProduct();
  const options = useSubCategoryOptions();

  const form = useForm<CreateProductValues>({
    resolver: zodResolver(SchemaCreateProduct),
    defaultValues: { name: "", slug: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const { nameField, slugField, regenerateSlug } = useSlugField(form);

  const onSubmit: SubmitHandler<CreateProductValues> = async (data) => {
    try {
      const created = await createProduct(data);
      toast.success("Produto criado com sucesso!");
      // Vai para a edição, onde é possível enviar a imagem do produto
      navigate(created?.id ? `/dashboard/products/${created.id}` : "/dashboard/products");
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar produto. Tente novamente."));
    }
  };

  return {
    nameField,
    slugField,
    descriptionField: register("description"),
    subCategoryField: register("subCategorieId"),
    regenerateSlug,
    errors,
    isPending,
    options,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/products"),
  };
};
