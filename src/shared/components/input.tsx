import { EyeOff } from "lucide-react";
import React, { useState } from "react";
import { tv } from "tailwind-variants";
import { cn } from "../utils/utils";

const InputStyle = tv({
  base: "w-full py-4 pl-6 pr-10 text-black bg-transparent border rounded-lg outline-none border-stroke focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
  variants: {
    size: {
      sm: "py-2 pl-4 pr-8",
      md: "py-4 pl-6 pr-10",
      lg: "py-6 pl-8 pr-12",
    },
    color: {
      primary: "text-primary focus:border-primary dark:focus:border-primary",
      secondary:
        "text-secondary focus:border-secondary dark:focus:border-secondary",
      danger: "text-danger focus:border-danger dark:focus:border-danger",
      success: "text-success focus:border-success dark:focus:border-success",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  sizeType?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "danger" | "success";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ sizeType, color, type='text', children, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    
    return (
      <div className="mb-2">
        {children}
        <div className="relative">
          <input
            {...props}
            className={cn(
              InputStyle({ size: sizeType, color }),
              props.className
            )}
            ref={ref}
            type={type === "password" && open ? "text" : type}
          />
          {props.icon && type !== "password" && (
            <span className="absolute right-4 top-4">{props.icon}</span>
          )}

          {type === "password" && (
            <span
              className="absolute cursor-pointer right-4 top-4"
              onClick={() => setOpen(!open)}
            >
              {open ? <EyeOff size={24} /> : <>{props.icon}</>}
            </span>
          )}
        </div>
        {props.error && (
          <span className="my-2 text-xs font-bold t text-danger">
            {props.error}
          </span>
        )}
      </div>
    );
  }
);

export { Input };
