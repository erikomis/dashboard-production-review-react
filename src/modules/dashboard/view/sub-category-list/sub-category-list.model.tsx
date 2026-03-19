import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuerySubCategory } from "@/modules/dashboard/hooks/useQuerySubCategory";
import { useMutationDeleteSubCategory } from "@/modules/dashboard/hooks/useMutationSubCategory";

export const useSubCategoryListModel = () => {
  const { data, isLoading, isError } = useQuerySubCategory();
  const navigate = useNavigate();
  const { mutateAsync: deleteSubCategory } = useMutationDeleteSubCategory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteRequest = (id: string) => setDeleteId(id);
  const handleDeleteCancel = () => setDeleteId(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteSubCategory(deleteId);
      toast.success("Subcategoria excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir subcategoria.");
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
