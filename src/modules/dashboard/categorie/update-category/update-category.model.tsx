import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UpdateCategory } from "./update-category.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCategorySchema } from "./update-category.schema";
import { useMutationUpdateCatetory } from "../../hooks/category/useMutationUpdateCategory";
import { CategoryService } from "../../services/category.service";
import { AxiosError } from "axios";
import { useState } from "react";

export const useUpdateCategoryModel = (
  updateCategoryService: typeof CategoryService.update
) => {
  const [categoryState, setCategoryState] = useState<UpdateCategory>(
    {} as UpdateCategory
  );
  const [isOpen, setIsOpen] = useState(false);
  const updateCategory = (category: UpdateCategory) => {
    setIsOpen(true);

    setCategoryState({
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
    });
  };

  const onClose = () => {
    setIsOpen(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCategory>({
    resolver: zodResolver(UpdateCategorySchema),
    values: categoryState,
  });

  const { mutate } = useMutationUpdateCatetory(updateCategoryService);
  const onSubmit = async (data: UpdateCategory) => {
    mutate(
      {
        id: categoryState.id,
        name: data.name,
        description: data.description,
        slug: data.slug,
      },
      {
        onSuccess: () => {
          toast.success("Categoria Atualizada com sucesso!");
        },
        onError: (er) => {
          const message =
            (er as AxiosError<{ message: string }>)?.response?.data?.message ||
            (er as Error).message;
          toast.error(message);
        },
      }
    );
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    isOpen,
    onClose,
    updateCategory,
  };
};
