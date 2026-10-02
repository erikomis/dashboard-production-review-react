import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { cn } from "@/shared/utils/utils";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Conteúdo acima do título (ex.: selos de status). */
  eyebrow?: React.ReactNode;
  children: React.ReactNode;
  /** Ações fixas no rodapé. */
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Painel lateral (dialog modal): foco preso, Esc fecha, foco volta para quem abriu.
 * No celular ocupa a tela toda; no desktop, uma coluna à direita.
 */
export const Drawer = ({ isOpen, onClose, title, description, eyebrow, children, footer, className }: DrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useFocusTrap(panelRef, isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-99999 flex justify-end bg-black/50 backdrop-blur-[2px] animate-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "flex h-full w-full max-w-xl flex-col bg-white shadow-default animate-slide-in-right focus:outline-none dark:bg-boxdark sm:border-l sm:border-stroke sm:dark:border-strokedark",
          className
        )}
      >
        <header className="flex items-start gap-4 border-b border-stroke px-5 py-4 dark:border-strokedark sm:px-6">
          <div className="min-w-0 flex-1">
            {eyebrow && <div className="mb-1.5 flex flex-wrap items-center gap-2">{eyebrow}</div>}
            <h2 id={titleId} className="text-lg font-semibold text-black dark:text-white">
              {title}
            </h2>
            {description && (
              <div id={descriptionId} className="mt-0.5 text-sm text-body dark:text-bodydark">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel"
            className="-m-1 rounded-md p-1.5 text-body hover:bg-gray-2 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-bodydark dark:hover:bg-meta-4 dark:hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <footer className="flex flex-col-reverse gap-3 border-t border-stroke bg-gray-2/60 px-5 py-4 dark:border-strokedark dark:bg-meta-4/30 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};

/** Seção do painel com título pequeno. */
export const DrawerSection = ({
  title,
  titleId,
  actions,
  children,
  className,
}: {
  title: React.ReactNode;
  titleId?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <section aria-labelledby={titleId} className={cn("border-b border-stroke px-5 py-5 last:border-b-0 dark:border-strokedark sm:px-6", className)}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 id={titleId} className="text-sm font-semibold text-black dark:text-white">
        {title}
      </h3>
      {actions}
    </div>
    {children}
  </section>
);
