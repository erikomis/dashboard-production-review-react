import { useId } from "react";
import { Table2 } from "lucide-react";
import { Card } from "../card/Card";

export type ChartTableColumn = { key: string; label: string; align?: "left" | "right" };

type ChartCardProps = {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  /** Resumo em texto (lido antes do gráfico por leitores de tela). */
  summary?: React.ReactNode;
  /** Tabela alternativa com os mesmos dados do gráfico. */
  table?: {
    caption: string;
    columns: ChartTableColumn[];
    rows: Record<string, React.ReactNode>[];
  };
  isEmpty?: boolean;
  emptyMessage?: string;
  /** Mantém o gráfico anterior esmaecido enquanto recarrega (sem "piscar" esqueleto). */
  isRefreshing?: boolean;
  children: React.ReactNode;
};

/**
 * Moldura padrão dos gráficos: título, descrição, resumo acessível e
 * a tabela de dados em `<details>` (alternativa ao gráfico).
 */
export const ChartCard = ({
  title,
  description,
  actions,
  className,
  summary,
  table,
  isEmpty,
  emptyMessage = "Sem dados no período.",
  isRefreshing,
  children,
}: ChartCardProps) => {
  const titleId = useId();
  return (
    <Card title={title} titleId={titleId} description={description} actions={actions} className={className}>
      <figure aria-labelledby={titleId} className="m-0">
        {summary && <figcaption className="mb-3 text-sm text-body dark:text-bodydark">{summary}</figcaption>}
        <div
          aria-busy={isRefreshing || undefined}
          className={isRefreshing ? "opacity-60 transition-opacity" : "transition-opacity"}
        >
          {isEmpty ? (
            <p className="flex h-40 items-center justify-center rounded-lg border border-dashed border-stroke text-sm text-body dark:border-strokedark dark:text-bodydark">
              {emptyMessage}
            </p>
          ) : (
            children
          )}
        </div>
        {table && table.rows.length > 0 && (
          <details className="group mt-4 rounded-lg border border-stroke dark:border-strokedark">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-gray-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-primary-light dark:hover:bg-meta-4 [&::-webkit-details-marker]:hidden">
              <Table2 size={16} aria-hidden="true" />
              <span className="group-open:hidden">Ver dados em tabela</span>
              <span className="hidden group-open:inline">Ocultar tabela</span>
            </summary>
            <div className="relative max-h-72 overflow-auto border-t border-stroke dark:border-strokedark">
              <table className="w-full text-left text-sm tabular-nums">
                <caption className="sr-only">{table.caption}</caption>
                <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4">
                  <tr>
                    {table.columns.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide text-black dark:text-bodydark1 ${col.align === "right" ? "text-right" : ""}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, index) => (
                    <tr key={index} className="border-t border-stroke dark:border-strokedark">
                      {table.columns.map((col, colIndex) =>
                        colIndex === 0 ? (
                          <th
                            key={col.key}
                            scope="row"
                            className="px-3 py-1.5 font-normal text-black dark:text-bodydark1"
                          >
                            {row[col.key]}
                          </th>
                        ) : (
                          <td
                            key={col.key}
                            className={`px-3 py-1.5 text-black dark:text-bodydark1 ${col.align === "right" ? "text-right" : ""}`}
                          >
                            {row[col.key]}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </figure>
    </Card>
  );
};
