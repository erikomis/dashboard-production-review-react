import React, { useId } from "react";
import { cn } from "../utils/utils";
import { FieldError, FieldHint } from "./form/field-message";
import { describedBy, fieldBaseClass, fieldBorderClass } from "./form/field-utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
  error?: string;
  hint?: React.ReactNode;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ children, error, hint, className, id: idProp, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    return (
      <div className="mb-4">
        {children}
        <textarea
          {...props}
          id={id}
          ref={ref}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(fieldBaseClass, fieldBorderClass(!!error), "resize-y", className)}
        />
        <FieldHint id={id}>{hint}</FieldHint>
        <FieldError id={id} message={error} />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
