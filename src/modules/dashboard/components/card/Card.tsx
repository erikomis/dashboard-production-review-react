import { cn } from "@/shared/utils/utils";

type CardProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** id do título, para `aria-labelledby` de seções. */
  titleId?: string;
};

export const Card = ({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  titleId,
}: CardProps) => (
  <section
    aria-labelledby={title ? titleId : undefined}
    className={cn(
      "rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
      className
    )}
  >
    {(title || actions) && (
      <div className="flex flex-col gap-3 border-b border-stroke px-5 py-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          {title && (
            <h2 id={titleId} className="text-base font-semibold text-black dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-body dark:text-bodydark">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    )}
    {/* `p-0` no corpo = conteúdo encostado nas bordas (listas): sem o padding responsivo padrão */}
    <div className={cn(!bodyClassName?.split(/\s+/).includes("p-0") && "p-5 sm:p-6", bodyClassName)}>{children}</div>
  </section>
);
