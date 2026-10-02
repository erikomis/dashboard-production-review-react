import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils/utils";
import { FieldError, FieldHint } from "./form/field-message";
import { describedBy, fieldBaseClass, fieldBorderClass } from "./form/field-utils";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
  /** Normalmente o `<Label />` do campo. */
  label?: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
}

/** `<select>` nativo (acessível por padrão) com o visual dos demais campos. */
export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ children, label, error, hint, className, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    return (
      <div className="mb-4">
        {label}
        <div className="relative">
          <select
            {...props}
            id={id}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, hint, error)}
            className={cn(
              fieldBaseClass,
              fieldBorderClass(!!error),
              "appearance-none pr-11",
              className
            )}
          >
            {children}
          </select>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
          />
        </div>
        <FieldHint id={id}>{hint}</FieldHint>
        <FieldError id={id} message={error} />
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
