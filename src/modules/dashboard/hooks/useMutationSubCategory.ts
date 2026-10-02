import { useMutation } from "@tanstack/react-query";
import { SubCategoryService } from "@/modules/dashboard/services/sub-category.service";
import { queryClient } from "@/shared/libs/react-query";
import { SubCategoryPayload } from "@/shared/types/category";

type SubCategoryUpdatePayload = SubCategoryPayload & { id: number | string };

// A lista de categorias traz as subcategorias aninhadas: invalida as duas.
const invalidate = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["sub-categories"] }),
    queryClient.invalidateQueries({ queryKey: ["categories"] }),
  ]);

export const useMutationSubCategory = () =>
  useMutation({
    mutationFn: (subCategory: SubCategoryPayload) => SubCategoryService.create(subCategory),
    onSuccess: invalidate,
  });

export const useMutationUpdateSubCategory = () =>
  useMutation({
    mutationFn: (subCategory: SubCategoryUpdatePayload) => SubCategoryService.update(subCategory),
    onSuccess: invalidate,
  });

/**
 * O backend hoje responde 204 no DELETE mas não remove a subcategoria (o cascade
 * de Category.subCategories desfaz a exclusão). Confere com um GET para não
 * mostrar "excluída com sucesso" quando nada mudou.
 */
const deleteAndVerify = async (id: number | string) => {
  await SubCategoryService.delete(id);
  const stillExists = await SubCategoryService.getById(id).then(
    () => true,
    () => false
  );
  if (stillExists) {
    throw new Error(
      "O servidor confirmou a exclusão, mas a subcategoria continua cadastrada. Avise a equipe do backend."
    );
  }
};

export const useMutationDeleteSubCategory = () =>
  useMutation({
    mutationFn: deleteAndVerify,
    onSettled: invalidate,
  });
