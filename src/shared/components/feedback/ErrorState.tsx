import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "../button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
};

export const ErrorState = ({
  title = "Não foi possível carregar os dados",
  description = "Verifique sua conexão e tente novamente.",
  onRetry,
  action,
}: ErrorStateProps) => (
  <div role="alert" className="flex flex-col items-center justify-center px-4 py-12 text-center">
    <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light">
      <TriangleAlert size={30} aria-hidden="true" />
    </span>
    <h3 className="text-base font-semibold text-black dark:text-white">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-body dark:text-bodydark">{description}</p>
    <div className="mt-5 flex gap-3">
      {onRetry && (
        <Button color="outline" onClick={onRetry} leftIcon={<RefreshCw size={16} aria-hidden="true" />}>
          Tentar novamente
        </Button>
      )}
      {action}
    </div>
  </div>
);
