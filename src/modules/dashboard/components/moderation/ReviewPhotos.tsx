import { ImageIcon } from "lucide-react";
import { cn } from "@/shared/utils/utils";

type ReviewPhotosProps = {
  photos: { id: number; src: string }[];
  /** Título da avaliação, para os rótulos ("Foto 1 da avaliação “Ok”"). */
  reviewTitle: string;
  onOpen: (index: number) => void;
  size?: "sm" | "md";
  /** Quantas mostrar antes do "+N". */
  max?: number;
};

/** Miniaturas clicáveis das fotos de uma avaliação (abrem o visualizador). */
export const ReviewPhotos = ({ photos, reviewTitle, onOpen, size = "sm", max = 3 }: ReviewPhotosProps) => {
  if (photos.length === 0) return null;
  const visible = photos.slice(0, max);
  const extra = photos.length - visible.length;
  const box = size === "sm" ? "h-10 w-10" : "h-20 w-20";
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={`Fotos da avaliação “${reviewTitle}”`}>
      {visible.map((photo, index) => {
        const isLast = index === visible.length - 1 && extra > 0;
        return (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`Ampliar foto ${index + 1} de ${photos.length} da avaliação “${reviewTitle}”`}
              className={cn(
                "group relative block overflow-hidden rounded-md border border-stroke bg-gray-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-strokedark dark:bg-meta-4",
                box
              )}
            >
              <img
                src={photo.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {isLast && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-semibold text-white">
                  +{extra}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

/** Indicador compacto "2 fotos" para listas densas. */
export const PhotoCount = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="inline-flex items-center gap-1">
      <ImageIcon size={12} aria-hidden="true" />
      {count} {count === 1 ? "foto" : "fotos"}
    </span>
  ) : null;
