import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface PaginationProps {
  /** Página atual, 0-based (igual à API). */
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
  /** Ex.: "produtos". */
  itemLabel?: string;
}

/** Números visíveis: primeira, última, vizinhas da atual e reticências. */
const visiblePages = (current: number, total: number): (number | "gap")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = new Set([0, total - 1, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
};

const baseBtn =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

export const Pagination = ({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  itemLabel = "itens",
}: PaginationProps) => {
  if (totalElements === 0) return null;
  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <div className="flex flex-col items-center gap-3 border-t border-stroke px-5 py-4 dark:border-strokedark sm:flex-row sm:justify-between sm:px-6">
      <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
        Mostrando <span className="font-medium text-black dark:text-white">{from}</span>–
        <span className="font-medium text-black dark:text-white">{to}</span> de{" "}
        <span className="font-medium text-black dark:text-white">{totalElements}</span> {itemLabel}
      </p>

      {totalPages > 1 && (
        <nav aria-label="Paginação">
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              <button
                type="button"
                className={cn(baseBtn, "border-stroke text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4")}
                onClick={() => onPageChange(page - 1)}
                disabled={isFirst}
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span className="ml-1 hidden sm:inline">Anterior</span>
              </button>
            </li>
            {visiblePages(page, totalPages).map((p, i) =>
              p === "gap" ? (
                <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-body dark:text-bodydark">
                  …
                </li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    className={cn(
                      baseBtn,
                      p === page
                        ? "border-primary bg-primary text-white"
                        : "border-stroke text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
                    )}
                    onClick={() => onPageChange(p)}
                    aria-label={`Página ${p + 1}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p + 1}
                  </button>
                </li>
              )
            )}
            <li>
              <button
                type="button"
                className={cn(baseBtn, "border-stroke text-black hover:bg-gray-2 dark:border-strokedark dark:text-white dark:hover:bg-meta-4")}
                onClick={() => onPageChange(page + 1)}
                disabled={isLast}
                aria-label="Próxima página"
              >
                <span className="mr-1 hidden sm:inline">Próxima</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
