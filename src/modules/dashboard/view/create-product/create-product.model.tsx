import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationCreateProduct } from "@/modules/dashboard/hooks/useMutationProduct";
import { SchemaCreateProduct } from "./create-product.schema";
import { CreateProductValues } from "./create-product.type";

export const useCreateProductModel = () => {
  const navigate = useNavigate();
  const { mutateAsync: createProduct, isPending } = useMutationCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductValues>({
    resolver: zodResolver(SchemaCreateProduct),
  });

  const onSubmit: SubmitHandler<CreateProductValues> = async (data) => {
    try {
      await createProduct(data);
      toast.success("Produto criado com sucesso!");
      navigate("/dashboard/products");
    } catch {
      toast.error("Erro ao criar produto. Tente novamente.");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isPending,
    onSubmit,
    navigate,
  };
};
