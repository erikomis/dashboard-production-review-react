import { Save } from "lucide-react";
import { Button } from "@/shared/components/button";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Skeleton } from "@/shared/components/skeleton";
import { FormActions, RequiredFieldsNote } from "../form/FormSection";

type EntityFormLayoutProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  pendingLabel?: string;
  children: React.ReactNode;
  /** Edição: enquanto carrega o registro. */
  isLoading?: boolean;
  /** Edição: falha ao carregar o registro. */
  loadError?: { title: string; description: string; onRetry?: () => void } | null;
  ariaLabel: string;
};

/** Card do formulário com estados de carregando/erro e barra de ações padronizada. */
export const EntityFormLayout = ({
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
  pendingLabel = "Salvando...",
  children,
  isLoading,
  loadError,
  ariaLabel,
}: EntityFormLayoutProps) => {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Carregando formulário"
        className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <ErrorState
          title={loadError.title}
          description={loadError.description}
          onRetry={loadError.onRetry}
          action={
            <Button color="ghost" onClick={onCancel}>
              Voltar para a lista
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label={ariaLabel}
      aria-busy={isPending || undefined}
      className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div className="p-5 sm:p-6">
        <RequiredFieldsNote />
        {children}
      </div>
      <FormActions>
        <Button type="button" color="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          leftIcon={<Save size={18} aria-hidden="true" />}
        >
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </FormActions>
    </form>
  );
};
