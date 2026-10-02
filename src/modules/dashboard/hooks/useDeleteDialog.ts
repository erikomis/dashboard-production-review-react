import { useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/shared/utils/error-message";

export type DeleteTarget = { id: number; name: string };

/**
 * Estado + handlers do modal de exclusão, iguais em todas as listagens.
 * Mostra no toast a `message` do backend (ex.: 409 com subcategorias vinculadas).
 */
export const useDeleteDialog = ({
  remove,
  successMessage,
  errorFallback,
}: {
  remove: (id: number) => Promise<unknown>;
  successMessage: string;
  errorFallback: string;
}) => {
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (target: DeleteTarget) => setDeleteTarget(target);
  const handleDeleteCancel = () => {
    if (!isDeleting) setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success(successMessage);
    } catch (error) {
      toast.error(getErrorMessage(error, errorFallback));
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return { deleteTarget, isDeleting, handleDeleteRequest, handleDeleteCancel, handleDeleteConfirm };
};
