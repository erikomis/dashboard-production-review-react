import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";

type ModalProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /** Ícone opcional ao lado do título. */
  icon?: React.ReactNode;
  role?: "dialog" | "alertdialog";
};

export const Modal = ({
  title,
  description,
  children,
  isOpen,
  onClose,
  icon,
  role = "dialog",
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(dialogRef, isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-999999 flex items-end justify-center bg-black/60 px-4 py-6 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-stroke bg-white p-6 shadow-default focus:outline-none dark:border-strokedark dark:bg-boxdark"
      >
        <div className="mb-4 flex items-start gap-4">
          {icon}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-semibold text-black dark:text-white">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-1 text-sm text-body dark:text-bodydark">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-m-1 rounded-md p-1 text-body hover:bg-gray-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
