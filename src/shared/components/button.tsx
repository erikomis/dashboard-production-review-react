import * as React from "react";
import { tv } from "tailwind-variants";
import { cn } from "../utils/utils";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    color: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      danger: "bg-danger text-danger-foreground hover:bg-danger/90",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      xs: "h-6 rounded-md px-2 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },

    defaultVariants: {
      color: "default",
      size: "default",
    },
  },
});

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
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color, size, children, className, ...props }, ref) => {
    return (
      <button
        className={cn( buttonVariants({ color, size }),
          className
        )}
        ref={ref}
        {...props}
      >
        {props.value}
        {children}
      </button>
    );
  }
);

export { Button };
