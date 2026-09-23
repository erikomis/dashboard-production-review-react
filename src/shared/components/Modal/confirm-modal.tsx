import { Modal } from "./modal";
import { Button } from "../button";

type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  return (
    <Modal title="Confirmar exclusão" isOpen={isOpen} onClose={onClose}>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex items-center justify-end gap-3">
        <Button color="outline" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button color="danger" size="sm" onClick={onConfirm}>
          Excluir
        </Button>
      </div>
    </Modal>
  );
};
