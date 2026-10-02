type TooltipRow = { label: string; value: React.ReactNode; color?: string };

type ChartTooltipProps = {
  active?: boolean;
  title?: React.ReactNode;
  rows: TooltipRow[];
};

/** Conteúdo do tooltip dos gráficos (HTML, então segue o tema claro/escuro pelas classes). */
export const ChartTooltipBox = ({ active, title, rows }: ChartTooltipProps) => {
  if (!active || rows.length === 0) return null;
  return (
    <div className="rounded-lg border border-stroke bg-white px-3 py-2 text-xs shadow-default dark:border-strokedark dark:bg-boxdark">
      {title && <p className="mb-1 font-semibold text-black dark:text-white">{title}</p>}
      <ul className="space-y-0.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2 text-body dark:text-bodydark">
            {row.color && (
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ background: row.color }} />
            )}
            {row.label}:
            <span className="ml-auto pl-3 font-semibold tabular-nums text-black dark:text-white">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
