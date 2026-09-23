import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryReviews } from "@/modules/dashboard/hooks/useQueryReviews";
import { useMutationDeleteReview } from "@/modules/dashboard/hooks/useMutationReview";

export const useReviewListModel = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQueryReviews(page);
  const navigate = useNavigate();
  const { mutateAsync: deleteReview } = useMutationDeleteReview();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalPages = data?.totalPages ?? 1;

  const handleDeleteRequest = (id: string) => setDeleteId(id);
  const handleDeleteCancel = () => setDeleteId(null);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteReview(deleteId);
      toast.success("Avaliação excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir avaliação.");
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
