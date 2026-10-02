import { TriangleAlert } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "../button";

type ConfirmModalProps = {
  isOpen: boolean;
  /** Texto principal (ex.: "Excluir a categoria “Casa”?"). */
  message: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  confirmLabel?: string;
  isLoading?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onClose,
  title = "Confirmar exclusão",
  confirmLabel = "Excluir",
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      role="alertdialog"
      description={
        <>
          <p>{message}</p>
          <p className="mt-1">Esta ação não pode ser desfeita.</p>
        </>
      }
      icon={
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light">
          <TriangleAlert size={22} aria-hidden="true" />
        </span>
      }
    >
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button color="outline" onClick={onClose} disabled={isLoading} data-autofocus>
          Cancelar
        </Button>
        <Button color="danger" onClick={onConfirm} isLoading={isLoading}>
          {isLoading ? "Excluindo..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
