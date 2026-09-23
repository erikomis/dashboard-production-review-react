import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { useMutationDeleteProduct } from "@/modules/dashboard/hooks/useMutationProduct";

export const useProductListModel = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQueryProducts(page);
  const navigate = useNavigate();
  const { mutateAsync: deleteProduct } = useMutationDeleteProduct();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = data?.totalPages ?? 1;

  const handleDeleteRequest = (id: string) => setDeleteId(id);
  const handleDeleteCancel = () => setDeleteId(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      toast.success("Produto excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir produto.");
    } finally {
      setDeleteId(null);
    }
  };

  return {
    page,
    setPage,
    data,
    isLoading,
    isError,
    totalPages,
    deleteId,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    navigate,
  };
};
