import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";
import { cn } from "../utils/utils";
import { FieldError, FieldHint } from "./form/field-message";
import { describedBy, fieldBaseClass, fieldBorderClass } from "./form/field-utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  sizeType?: "sm" | "md" | "lg";
  /** Mantido por compatibilidade; a cor de foco é sempre `primary`. */
  color?: "primary" | "secondary" | "danger" | "success";
  /** Normalmente o `<Label />` do campo. */
  children?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
  /** Conteúdo fixo à esquerda (ex.: "/" do slug). */
  prefix?: string;
}

const sizes = {
  sm: "py-2 text-sm",
  md: "py-3",
  lg: "py-4 text-lg",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      sizeType = "md",
      color: _color,
      type = "text",
      children,
      icon,
      error,
      hint,
      prefix,
      className,
      id: idProp,
      ...props
    },
    ref
  ) => {
    void _color;
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const hasTrailing = isPassword || !!icon;

    return (
      <div className="mb-4">
        {children}
        <div className="relative">
          {prefix && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
            >
              {prefix}
            </span>
          )}
          <input
            {...props}
            id={id}
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(id, hint, error)}
            className={cn(
              fieldBaseClass,
              fieldBorderClass(!!error),
              sizes[sizeType],
              hasTrailing && "pr-12",
              prefix && "pl-8",
              className
            )}
          />
          {icon && !isPassword && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
            >
              {icon}
            </span>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              aria-controls={id}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-body hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-bodydark"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        <FieldHint id={id}>{hint}</FieldHint>
        <FieldError id={id} message={error} />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
