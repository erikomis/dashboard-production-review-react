import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { cn } from "@/shared/utils/utils";

export type LightboxImage = { id: number | string; src: string; alt: string };

type LightboxProps = {
  isOpen: boolean;
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Título do diálogo (ex.: "Fotos da avaliação “Ok”"). */
  title: string;
  /** Mostra "Remover foto" (ADMIN). */
  onRemove?: (image: LightboxImage) => void;
  isRemoving?: boolean;
};

const navButton =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-30";

/**
 * Visualizador de fotos acessível: diálogo modal, foco preso, Esc fecha,
 * setas ← → trocam de foto e a posição é anunciada ("Foto 2 de 3").
 */
export const Lightbox = ({
  isOpen,
  images,
  index,
  onIndexChange,
  onClose,
  title,
  onRemove,
  isRemoving = false,
}: LightboxProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(dialogRef, isOpen, onClose);

  if (!isOpen || images.length === 0) return null;
  const safeIndex = Math.min(Math.max(index, 0), images.length - 1);
  const current = images[safeIndex];
  const hasMany = images.length > 1;
  const go = (delta: number) => onIndexChange((safeIndex + delta + images.length) % images.length);

  return createPortal(
    <div
      className="fixed inset-0 z-999999 flex items-center justify-center bg-black/85 p-4 animate-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-roledescription="visualizador de fotos"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (!hasMany) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
          }
        }}
        className="flex max-h-full w-full max-w-4xl flex-col gap-3 animate-scale-in focus:outline-none"
      >
        <div className="flex items-center justify-between gap-3 text-white">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-base font-semibold">
              {title}
            </h2>
            <p className="text-sm text-white/80" aria-live="polite">
              Foto {safeIndex + 1} de {images.length}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(current)}
                disabled={isRemoving}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-danger px-3 text-sm font-medium text-white hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-60"
              >
                <Trash2 size={16} aria-hidden="true" />
                {isRemoving ? "Removendo..." : "Remover foto"}
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Fechar visualizador" className={navButton} data-autofocus>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <img
            key={current.id}
            src={current.src}
            alt={current.alt}
            className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl animate-fade-in"
          />
          {hasMany && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className={cn(navButton, "absolute left-2 top-1/2 -translate-y-1/2")}
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima foto"
                className={cn(navButton, "absolute right-2 top-1/2 -translate-y-1/2")}
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {hasMany && (
          <ul className="flex justify-center gap-2" aria-label="Miniaturas">
            {images.map((image, i) => (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={i === safeIndex ? "true" : undefined}
                  className={cn(
                    "block h-14 w-14 overflow-hidden rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    i === safeIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={image.src} alt="" className="h-full w-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
};
