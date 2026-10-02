import { WandSparkles } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";

type SlugFieldProps = {
  field: UseFormRegisterReturn;
  error?: string;
  onRegenerate: () => void;
  id?: string;
};

export const SlugField = ({ field, error, onRegenerate, id = "slug" }: SlugFieldProps) => (
  <div className="relative">
    <div className="flex items-center justify-between gap-2">
      <Label value="Slug" htmlFor={id} required />
      <button
        type="button"
        onClick={onRegenerate}
        className="-mt-2 inline-flex items-center gap-1 rounded px-1 text-xs font-medium text-primary hover:underline dark:text-primary-light"
      >
        <WandSparkles size={14} aria-hidden="true" />
        Gerar a partir do nome
      </button>
    </div>
    <Input
      id={id}
      prefix="/"
      autoComplete="off"
      spellCheck={false}
      placeholder="ex.: eletronicos"
      error={error}
      hint="Gerado automaticamente a partir do nome. Use letras minúsculas, números e hífens."
      className="font-mono text-sm"
      {...field}
    />
  </div>
);
