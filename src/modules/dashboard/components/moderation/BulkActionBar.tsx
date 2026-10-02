import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/shared/components/button";

type BulkActionBarProps = {
  /** Quantas avaliações estão selecionadas. */
  count: number;
  /** Quantas das selecionadas podem ser ocultadas (estão visíveis). */
  hideCount: number;
  /** Quantas das selecionadas podem ser restauradas (estão ocultas). */
  restoreCount: number;
  onHide: () => void;
  onRestore: () => void;
  onClear: () => void;
  isBusy?: boolean;
};

/**
 * Barra fixa no rodapé enquanto há seleção. As ações só valem para as avaliações
 * em que fazem sentido (ex.: "Restaurar" conta só as ocultas).
 */
export const BulkActionBar = ({
  count,
  hideCount,
  restoreCount,
  onHide,
  onRestore,
  onClear,
  isBusy = false,
}: BulkActionBarProps) => {
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-999 flex justify-center px-4 lg:pl-72.5">
      <section
        aria-label="Ações em lote"
        className="pointer-events-auto flex w-full max-w-[56rem] flex-col gap-3 overflow-hidden rounded-xl border border-stroke bg-black px-4 py-3 text-white shadow-6 animate-slide-up dark:border-strokedark dark:bg-meta-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <p className="whitespace-nowrap text-sm font-medium" aria-live="polite">
          <span className="tabular-nums">{count}</span> {count === 1 ? "avaliação selecionada" : "avaliações selecionadas"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onHide}
            disabled={hideCount === 0 || isBusy}
            title={hideCount === 0 ? "Nenhuma das selecionadas está visível" : undefined}
            leftIcon={<EyeOff size={16} aria-hidden="true" />}
          >
            Ocultar selecionadas{hideCount !== count && hideCount > 0 ? ` (${hideCount})` : ""}
          </Button>
          <Button
            size="sm"
            color="secondary"
            onClick={onRestore}
            disabled={restoreCount === 0 || isBusy}
            title={restoreCount === 0 ? "Nenhuma das selecionadas está oculta" : undefined}
            leftIcon={<Eye size={16} aria-hidden="true" />}
          >
            Restaurar selecionadas{restoreCount !== count && restoreCount > 0 ? ` (${restoreCount})` : ""}
          </Button>
          <button
            type="button"
            onClick={onClear}
            disabled={isBusy}
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
          >
            <X size={16} aria-hidden="true" />
            Limpar seleção
          </button>
        </div>
      </section>
    </div>
  );
};
