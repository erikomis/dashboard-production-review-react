import { Inbox } from "lucide-react";
import { cn } from "@/shared/utils/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  /** `primary` (padrão), `success` para "tudo em ordem" e `neutral` para listas vazias discretas. */
  tone?: "primary" | "success" | "neutral";
  /** Versão menor, para cartões e painéis. */
  compact?: boolean;
  className?: string;
};

const TONES = {
  primary: {
    ring: "bg-primary/[0.06] dark:bg-primary/10",
    icon: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light",
  },
  success: {
    ring: "bg-success/[0.07] dark:bg-success/10",
    icon: "bg-success/10 text-success-dark dark:bg-success/20 dark:text-success-light",
  },
  neutral: {
    ring: "bg-gray-2 dark:bg-meta-4/40",
    icon: "bg-gray text-body dark:bg-meta-4 dark:text-bodydark1",
  },
};

/** Estado vazio com ícone em anel duplo, título, explicação e uma ação clara. */
export const EmptyState = ({
  title,
  description,
  icon,
  action,
  tone = "primary",
  compact = false,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center px-4 text-center animate-fade-up",
      compact ? "py-6" : "py-12",
      className
    )}
  >
    <span
      aria-hidden="true"
      className={cn("mb-4 flex items-center justify-center rounded-full", TONES[tone].ring, compact ? "h-16 w-16" : "h-24 w-24")}
    >
      <span className={cn("flex items-center justify-center rounded-full", TONES[tone].icon, compact ? "h-11 w-11" : "h-16 w-16")}>
        {icon ?? <Inbox size={compact ? 22 : 30} aria-hidden="true" />}
      </span>
    </span>
    <h3 className={cn("font-semibold text-black dark:text-white", compact ? "text-sm" : "text-base")}>{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-body dark:text-bodydark">{description}</p>}
    {action && <div className={compact ? "mt-3" : "mt-5"}>{action}</div>}
  </div>
);
