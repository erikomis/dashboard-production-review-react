import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationCategory } from "@/modules/dashboard/hooks/useMutationCategory";
import { SchemaCreateCategory } from "./create-category.schema";
import { CreateCategoryValues } from "./create-category.type";

export const useCreateCategoryModel = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCategoryValues>({
    resolver: zodResolver(SchemaCreateCategory),
  });

  const onSubmit: SubmitHandler<CreateCategoryValues> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success("Categoria criada com sucesso!");
      navigate("/dashboard/categories");
    } catch {
      toast.error("Erro ao criar categoria. Tente novamente.");
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
