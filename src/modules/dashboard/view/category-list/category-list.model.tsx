import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryCategory } from "@/modules/dashboard/hooks/useQueryCategory";
import { useMutationDeleteCategory } from "@/modules/dashboard/hooks/useMutationCategory";

export const useCategoryListModel = () => {
  const { data, isLoading, isError } = useQueryCategory();
  const navigate = useNavigate();
  const { mutateAsync: deleteCategory } = useMutationDeleteCategory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteRequest = (id: string) => setDeleteId(id);
  const handleDeleteCancel = () => setDeleteId(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory(deleteId);
      toast.success("Categoria excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir categoria.");
    } finally {
      setDeleteId(null);
    }
  };

  return {
    data,
    isLoading,
    isError,
    deleteId,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    navigate,
  };
};
