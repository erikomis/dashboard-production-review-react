type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** Agrupa campos relacionados: título/ajuda à esquerda (desktop), campos à direita. */
export const FormSection = ({ title, description, children }: FormSectionProps) => (
  <fieldset className="grid gap-x-8 gap-y-4 border-b border-stroke py-6 first:pt-0 last:border-b-0 last:pb-0 dark:border-strokedark lg:grid-cols-3">
    <legend className="sr-only">{title}</legend>
    <div aria-hidden="true">
      <p className="text-sm font-semibold text-black dark:text-white">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-body dark:text-bodydark">{description}</p>
      )}
    </div>
    <div className="lg:col-span-2">{children}</div>
  </fieldset>
);

type FormActionsProps = { children: React.ReactNode };

export const FormActions = ({ children }: FormActionsProps) => (
  <div className="flex flex-col-reverse gap-3 border-t border-stroke px-5 py-4 dark:border-strokedark sm:flex-row sm:justify-end sm:px-6">
    {children}
  </div>
);

export const RequiredFieldsNote = () => (
  <p className="mb-6 text-sm text-body dark:text-bodydark">
    Campos marcados com <span aria-hidden="true" className="text-danger dark:text-danger-light">*</span>
    <span className="sr-only">asterisco</span> são obrigatórios.
  </p>
);
