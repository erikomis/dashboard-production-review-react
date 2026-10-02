import React, { useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../utils/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Nome acessível (fica só para leitores de tela se `showLabel` for falso). */
  label: string;
  showLabel?: boolean;
  /** Estado "alguns selecionados" (ex.: selecionar página com parte das linhas marcadas). */
  indeterminate?: boolean;
}

/** Checkbox nativo (teclado e leitores de tela de graça) com o visual do painel. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, showLabel = false, indeterminate = false, className, checked, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const on = checked || indeterminate;
    return (
      <label className={cn("relative inline-flex cursor-pointer items-center gap-2 text-sm", className)}>
        <input
          ref={setRef}
          type="checkbox"
          checked={checked}
          aria-checked={indeterminate ? "mixed" : undefined}
          className="peer absolute h-5 w-5 cursor-pointer opacity-0"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-[1.5px] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white peer-disabled:opacity-50 dark:peer-focus-visible:ring-offset-boxdark",
            on
              ? "border-primary bg-primary text-white"
              : "border-body/60 bg-white dark:border-bodydark2 dark:bg-boxdark"
          )}
        >
          {indeterminate ? <Minus size={14} strokeWidth={3} /> : checked ? <Check size={14} strokeWidth={3} /> : null}
        </span>
        <span className={showLabel ? "text-black dark:text-white" : "sr-only"}>{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
