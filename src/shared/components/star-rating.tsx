import { Star } from "lucide-react";
import { useId } from "react";
import { cn } from "../utils/utils";

const LABELS = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"];

type StarRatingProps = { value: number; size?: number; className?: string };

/** Exibição de nota (somente leitura) com nome acessível. */
export const StarRating = ({ value, size = 16, className }: StarRatingProps) => (
  <span
    role="img"
    aria-label={`Nota ${String(value).replace(".", ",")} de 5`}
    className={cn("inline-flex items-center gap-0.5", className)}
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        aria-hidden="true"
        className={
          i < Math.round(value)
            ? "fill-star text-star"
            : "fill-stroke text-stroke dark:fill-strokedark dark:text-strokedark"
        }
      />
    ))}
  </span>
);

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  name: string;
  legend: string;
  error?: string;
};

/**
 * Seleção de nota 1–5 como grupo de rádios nativos (setas do teclado funcionam).
 */
export const StarRatingInput = ({ value, onChange, name, legend, error }: StarRatingInputProps) => {
  const errorId = useId();
  return (
    <fieldset
      className="mb-4"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-2 block text-sm font-medium text-black dark:text-white">
        {legend}
        <span aria-hidden="true" className="ml-0.5 text-danger dark:text-danger-light">*</span>
        <span className="sr-only"> (obrigatório)</span>
      </legend>
      <div className="flex flex-wrap items-center gap-1">
        {LABELS.map((label, i) => {
          const starValue = i + 1;
          const active = starValue <= value;
          return (
            <label
              key={starValue}
              className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
              title={`${starValue} – ${label}`}
            >
              <input
                type="radio"
                name={name}
                value={starValue}
                checked={value === starValue}
                onChange={() => onChange(starValue)}
                className="sr-only"
              />
              <span className="sr-only">{`${starValue} de 5 – ${label}`}</span>
              <Star
                size={30}
                aria-hidden="true"
                className={cn(
                  "transition-colors",
                  active
                    ? "fill-star text-star"
                    : "fill-transparent text-body hover:text-star dark:text-bodydark"
                )}
              />
            </label>
          );
        })}
        <span className="ml-2 text-sm text-body dark:text-bodydark" aria-hidden="true">
          {value > 0 ? `${value}/5 · ${LABELS[value - 1]}` : "Selecione uma nota"}
        </span>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-danger dark:text-danger-light">
          {error}
        </p>
      )}
    </fieldset>
  );
};
