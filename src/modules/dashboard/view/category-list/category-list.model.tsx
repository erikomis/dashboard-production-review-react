import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useMutationDeleteCategory } from "@/modules/dashboard/hooks/useMutationCategory";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import { slugify } from "@/shared/utils/slugify";

export const useCategoryListModel = () => {
  const { data, isLoading, isError, refetch } = useQueryCategory();
  const navigate = useNavigate();
  const { mutateAsync: deleteCategory } = useMutationDeleteCategory();
  const [filter, setFilter] = useState("");

  const deleteDialog = useDeleteDialog({
    remove: (id) => deleteCategory(id),
    successMessage: "Categoria excluída com sucesso!",
    errorFallback: "Erro ao excluir categoria.",
  });

  const categories = useMemo(() => {
    const list = data ?? [];
    const term = slugify(filter);
    if (!term) return list;
    return list.filter(
      (c) => slugify(c.name).includes(term) || c.slug.includes(term)
    );
  }, [data, filter]);

  return {
    categories,
    total: data?.length ?? 0,
    filter,
    setFilter,
    isLoading,
    isError,
    refetch: () => void refetch(),
    ...deleteDialog,
    goToCreate: () => navigate("/dashboard/categories/add"),
    goToEdit: (id: number) => navigate(`/dashboard/categories/${id}`),
  };
};
