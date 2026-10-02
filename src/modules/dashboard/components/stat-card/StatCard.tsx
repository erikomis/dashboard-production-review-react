import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/shared/components/skeleton";
import { cn } from "@/shared/utils/utils";

type StatCardProps = {
  title: string;
  value?: number | string;
  icon: React.ReactNode;
  /** Classes do círculo do ícone. */
  iconClassName?: string;
  to?: string;
  linkLabel?: string;
  isLoading?: boolean;
  helper?: React.ReactNode;
};

export const StatCard = ({
  title,
  value,
  icon,
  iconClassName = "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light",
  to,
  linkLabel = "Ver todos",
  isLoading,
  helper,
}: StatCardProps) => (
  <div className="flex flex-col rounded-xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-body dark:text-bodydark">{title}</p>
        {isLoading ? (
          <Skeleton className="mt-2 h-9 w-16" />
        ) : (
          <p className="mt-1 text-title-md2 font-bold text-black dark:text-white">{value ?? "—"}</p>
        )}
        {helper && <p className="mt-1 text-xs text-body dark:text-bodydark">{helper}</p>}
      </div>
      <span
        aria-hidden="true"
        className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", iconClassName)}
      >
        {icon}
      </span>
    </div>
    {to && (
      <Link
        to={to}
        className="mt-4 inline-flex items-center gap-1 self-start rounded text-sm font-medium text-primary hover:underline dark:text-primary-light"
      >
        {linkLabel}
        <span className="sr-only">: {title}</span>
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    )}
  </div>
);
