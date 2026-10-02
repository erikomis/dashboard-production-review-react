import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuerySubCategory } from "@/modules/dashboard/hooks/useQuerySubCategory";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useMutationDeleteSubCategory } from "@/modules/dashboard/hooks/useMutationSubCategory";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import { slugify } from "@/shared/utils/slugify";

export const useSubCategoryListModel = () => {
  const { data, isLoading, isError, refetch } = useQuerySubCategory();
  const { data: categories } = useQueryCategory();
  const navigate = useNavigate();
  const { mutateAsync: deleteSubCategory } = useMutationDeleteSubCategory();
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const deleteDialog = useDeleteDialog({
    remove: (id) => deleteSubCategory(id),
    successMessage: "Subcategoria excluída com sucesso!",
    errorFallback: "Erro ao excluir subcategoria.",
  });

  const categoryNames = useMemo(
    () => new Map((categories ?? []).map((c) => [c.id, c.name])),
    [categories]
  );

  const subCategories = useMemo(() => {
    const term = slugify(filter);
    return (data ?? [])
      .filter((s) => !categoryFilter || String(s.categorieId) === categoryFilter)
      .filter((s) => !term || slugify(s.name).includes(term) || s.slug.includes(term))
      .map((s) => ({ ...s, categoryName: categoryNames.get(s.categorieId) }));
  }, [data, filter, categoryFilter, categoryNames]);

  const clearFilters = () => {
    setFilter("");
    setCategoryFilter("");
  };

  return {
    subCategories,
    total: data?.length ?? 0,
    categories: categories ?? [],
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    hasFilters: !!filter || !!categoryFilter,
    clearFilters,
    isLoading,
    isError,
    refetch: () => void refetch(),
    ...deleteDialog,
    goToCreate: () => navigate("/dashboard/sub-categories/add"),
    goToEdit: (id: number) => navigate(`/dashboard/sub-categories/${id}`),
  };
};
