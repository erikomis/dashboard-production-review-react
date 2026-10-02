import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, House } from "lucide-react";

export type Breadcrumb = { label: string; to?: string };

type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  /** O primeiro item ("Início") é adicionado automaticamente. */
  breadcrumbs?: Breadcrumb[];
  /** Ação principal (botão/link) alinhada à direita. */
  actions?: React.ReactNode;
};

/** Cabeçalho padrão das telas: breadcrumb, título (h1), descrição e ação principal. */
export const PageHeader = ({ title, description, breadcrumbs = [], actions }: PageHeaderProps) => {
  const items: Breadcrumb[] = [{ label: "Início", to: "/dashboard/home" }, ...breadcrumbs];

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <nav aria-label="Trilha de navegação" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-body dark:text-bodydark">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <Fragment key={`${item.label}-${index}`}>
                  <li className="flex items-center gap-1">
                    {index === 0 && <House size={14} aria-hidden="true" />}
                    {item.to && !isLast ? (
                      <Link
                        to={item.to}
                        className="rounded hover:text-primary hover:underline dark:hover:text-primary-light"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? "page" : undefined}
                        className={isLast ? "font-medium text-black dark:text-white" : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                  {!isLast && (
                    <li aria-hidden="true">
                      <ChevronRight size={14} />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>
        </nav>
        <h1 className="text-title-md font-bold text-black dark:text-white">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-body dark:text-bodydark">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
};
