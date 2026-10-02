import { cn } from "@/shared/utils/utils";

interface BrandMarkProps {
  className?: string;
}

/** Ícone da marca ReviewStore (o mesmo do site). Decorativo: o texto acessível vem do contexto. */
export const BrandMark = ({ className }: BrandMarkProps) => (
  <svg aria-hidden="true" viewBox="0 0 32 32" className={cn("h-10 w-10 shrink-0", className)}>
    <rect width="32" height="32" rx="8" className="fill-primary" />
    <path
      d="M16 6.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L16 21.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
      className="fill-white"
    />
  </svg>
);
