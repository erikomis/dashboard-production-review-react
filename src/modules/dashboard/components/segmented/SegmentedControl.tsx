import { useId } from "react";
import { cn } from "@/shared/utils/utils";

export type SegmentedOption<T extends string | number> = {
  value: T;
  label: React.ReactNode;
  /** Texto extra só para leitores de tela (ex.: "3 avaliações"). */
  srHint?: string;
};

type SegmentedControlProps<T extends string | number> = {
  /** Nome acessível do grupo. */
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** Mostra o rótulo visualmente (padrão: só para leitores de tela). */
  showLabel?: boolean;
};

/**
 * Grupo de opções exclusivas com rádios nativos: setas do teclado trocam a opção
 * e o leitor de tela anuncia "1 de 3, selecionado".
 */
export const SegmentedControl = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
  showLabel = false,
}: SegmentedControlProps<T>) => {
  const name = useId();
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className={showLabel ? "mb-1.5 text-xs font-medium text-body dark:text-bodydark" : "sr-only"}>
        {label}
      </legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-stroke bg-gray-2 p-1 dark:border-strokedark dark:bg-meta-4">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={String(option.value)}
              className={cn(
                "relative inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
                checked
                  ? "bg-white text-primary shadow-sm dark:bg-boxdark dark:text-primary-light"
                  : "text-body hover:text-black dark:text-bodydark dark:hover:text-white"
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
              {option.srHint && <span className="sr-only">, {option.srHint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
