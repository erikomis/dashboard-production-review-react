import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/utils";

type FilterSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  label: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  wrapperClassName?: string;
};

/** `<select>` compacto com rótulo visível, para barras de filtros. */
export const FilterSelect = ({
  label,
  onValueChange,
  children,
  className,
  wrapperClassName,
  id: idProp,
  ...props
}: FilterSelectProps) => {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <div className={cn("min-w-0", wrapperClassName)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-body dark:text-bodydark">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          id={id}
          onChange={(event) => onValueChange(event.target.value)}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-stroke bg-transparent pl-3 pr-9 text-sm text-black outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-form-strokedark dark:bg-form-input dark:text-white",
            className
          )}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
        />
      </div>
    </div>
  );
};

type FilterInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  wrapperClassName?: string;
};

/** `<input>` compacto (ex.: datas) com rótulo visível e erro ligado por `aria-describedby`. */
export const FilterInput = ({ label, error, className, wrapperClassName, id: idProp, ...props }: FilterInputProps) => {
  const generated = useId();
  const id = idProp ?? generated;
  const errorId = `${id}-error`;
  return (
    <div className={cn("min-w-0", wrapperClassName)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-body dark:text-bodydark">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-10 w-full rounded-lg border bg-transparent px-3 text-sm text-black outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-form-input dark:text-white dark:[color-scheme:dark]",
          error ? "border-danger dark:border-danger-light" : "border-stroke dark:border-form-strokedark",
          className
        )}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs font-medium text-danger dark:text-danger-light">
          {error}
        </p>
      )}
    </div>
  );
};
