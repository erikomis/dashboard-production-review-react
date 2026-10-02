import { Search, X } from "lucide-react";
import { useId } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
};

/** Campo de busca/filtro com label acessível (visualmente oculto) e botão limpar. */
export const SearchInput = ({ value, onChange, label, placeholder }: SearchInputProps) => {
  const id = useId();
  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        className="h-10 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-9 text-sm text-black outline-none placeholder:text-body/80 focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:placeholder:text-bodydark/70 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-body hover:text-black dark:text-bodydark dark:hover:text-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
