import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProductsService } from "@/modules/dashboard/services/products.service";
import { useMutationUpdateProduct } from "@/modules/dashboard/hooks/useMutationProduct";
import { SchemaEditProduct } from "./edit-product.schema";
import { EditProductValues } from "./edit-product.type";

export const useEditProductModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: updateProduct, isPending } = useMutationUpdateProduct();

  const { data, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => ProductsService.getById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProductValues>({
    resolver: zodResolver(SchemaEditProduct),
  });

  useEffect(() => {
    if (data) {
      reset({ name: data.name, description: data.description });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<EditProductValues> = async (formData) => {
    try {
      await updateProduct({ id: id!, ...formData });
      toast.success("Produto atualizado com sucesso!");
      navigate("/dashboard/products");
    } catch {
      toast.error("Erro ao atualizar produto. Tente novamente.");
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
