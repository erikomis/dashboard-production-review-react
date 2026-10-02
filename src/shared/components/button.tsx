import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { buttonVariants } from "./button-variants";
import { cn } from "../utils/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "danger";
  size?: "default" | "sm" | "xs" | "lg" | "icon";
  /** Mostra spinner, desabilita e marca `aria-busy`. */
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { color, size, children, className, isLoading, leftIcon, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ color, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
