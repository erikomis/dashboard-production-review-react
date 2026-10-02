import { CircleAlert } from "lucide-react";
import { fieldIds } from "./field-utils";

export const FieldHint = ({ id, children }: { id: string; children?: React.ReactNode }) =>
  children ? (
    <p id={fieldIds(id).hintId} className="mt-1.5 text-xs text-body dark:text-bodydark">
      {children}
    </p>
  ) : null;

export const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p
      id={fieldIds(id).errorId}
      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger dark:text-danger-light"
    >
      <CircleAlert size={14} aria-hidden="true" className="shrink-0" />
      {message}
    </p>
  ) : null;
