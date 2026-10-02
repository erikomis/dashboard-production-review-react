import React from "react";
import { tv } from "tailwind-variants";
import { cn } from "../utils/utils";

const iconButtonVariants = tv({
  base: "group/icon relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  variants: {
    color: {
      default:
        "text-body hover:bg-primary/10 hover:text-primary dark:text-bodydark dark:hover:bg-primary/20 dark:hover:text-primary-light",
      danger:
        "text-body hover:bg-danger/10 hover:text-danger dark:text-bodydark dark:hover:bg-danger/20 dark:hover:text-danger-light",
    },
  },
  defaultVariants: { color: "default" },
});

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: nome acessível e texto do tooltip. */
  label: string;
  color?: "default" | "danger";
  /** Alinhamento do tooltip: `end` encosta à direita (útil na última coluna de tabelas). */
  tooltipAlign?: "center" | "end";
  children: React.ReactNode;
}

/** Botão só com ícone: tem `aria-label` e tooltip visível no hover e no foco. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, color, className, children, tooltipAlign = "center", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ color }), className)}
      {...props}
    >
      <span aria-hidden="true">{children}</span>
      <span
        role="presentation"
        className={cn(
          "pointer-events-none absolute bottom-full z-50 mb-1.5 whitespace-nowrap",
          tooltipAlign === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
        )}
      >
        <span className="block rounded bg-black px-2 py-1 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover/icon:opacity-100 group-focus-visible/icon:opacity-100 dark:bg-meta-4">
          {label}
        </span>
      </span>
    </button>
  )
);

IconButton.displayName = "IconButton";
