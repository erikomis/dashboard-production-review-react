import { ShieldQuestion, TriangleAlert } from "lucide-react";
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
  /** Texto do botão enquanto confirma. */
  loadingLabel?: string;
  isLoading?: boolean;
  /** `danger` (padrão) para exclusões; `primary` para ações reversíveis. */
  tone?: "danger" | "primary";
  /** Mostra "Esta ação não pode ser desfeita." (padrão: true). */
  irreversible?: boolean;
};

export const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onClose,
  title = "Confirmar exclusão",
  confirmLabel = "Excluir",
  loadingLabel = "Excluindo...",
  isLoading = false,
  tone = "danger",
  irreversible = true,
}: ConfirmModalProps) => {
  const isDanger = tone === "danger";
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      role="alertdialog"
      description={
        <>
          <p>{message}</p>
          {irreversible && <p className="mt-1">Esta ação não pode ser desfeita.</p>}
        </>
      }
      icon={
        isDanger ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light">
            <TriangleAlert size={22} aria-hidden="true" />
          </span>
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
            <ShieldQuestion size={22} aria-hidden="true" />
          </span>
        )
      }
    >
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button color="outline" onClick={onClose} disabled={isLoading} data-autofocus>
          Cancelar
        </Button>
        <Button color={isDanger ? "danger" : "default"} onClick={onConfirm} isLoading={isLoading}>
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
