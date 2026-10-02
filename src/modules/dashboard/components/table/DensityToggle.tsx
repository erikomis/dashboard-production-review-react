import { Rows3, Rows4 } from "lucide-react";
import { TableDensity } from "@/shared/libs/preferences";
import { cn } from "@/shared/utils/utils";

const OPTIONS: { value: TableDensity; label: string; icon: React.ReactNode }[] = [
  { value: "comfortable", label: "Linhas confortáveis", icon: <Rows3 size={16} aria-hidden="true" /> },
  { value: "compact", label: "Linhas compactas", icon: <Rows4 size={16} aria-hidden="true" /> },
];

/** Alterna a densidade das linhas. Botões com `aria-pressed` e tooltip nativo. */
export const DensityToggle = ({ value, onChange }: { value: TableDensity; onChange: (value: TableDensity) => void }) => (
  <div role="group" aria-label="Densidade da tabela" className="inline-flex rounded-md border border-stroke p-0.5 dark:border-strokedark">
    {OPTIONS.map((option) => {
      const pressed = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          aria-pressed={pressed}
          aria-label={option.label}
          title={option.label}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            pressed
              ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
              : "text-body hover:text-black dark:text-bodydark dark:hover:text-white"
          )}
        >
          {option.icon}
        </button>
      );
    })}
  </div>
);
