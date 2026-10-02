import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
    <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
      {icon ?? <Inbox size={30} aria-hidden="true" />}
    </span>
    <h3 className="text-base font-semibold text-black dark:text-white">{title}</h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-body dark:text-bodydark">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
