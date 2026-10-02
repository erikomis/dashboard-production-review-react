import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { barWidth, formatNote } from "@/modules/dashboard/utils/chart-data";

export type RankedItem = {
  id: number;
  name: string;
  value: number;
  averageNote?: number | null;
  to?: string;
};

type RankedBarsProps = {
  items: RankedItem[];
  /** Ex.: "avaliações". */
  unit: string;
  label: string;
};

/**
 * Ranking em barras horizontais feitas em HTML: o texto (nome, total e média)
 * fica sempre visível, então a lista já é a alternativa textual do gráfico.
 */
export const RankedBars = ({ items, unit, label }: RankedBarsProps) => {
  const max = Math.max(0, ...items.map((i) => i.value));
  return (
    <ol aria-label={label} className="space-y-4">
      {items.map((item, index) => (
        <li key={item.id}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="w-4 shrink-0 text-right text-xs font-semibold tabular-nums text-body dark:text-bodydark">
                {index + 1}
              </span>
              {item.to ? (
                <Link
                  to={item.to}
                  className="truncate font-medium text-black hover:text-primary hover:underline dark:text-white dark:hover:text-primary-light"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="truncate font-medium text-black dark:text-white">{item.name}</span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-2 text-body dark:text-bodydark">
              <span className="tabular-nums">
                <span className="font-semibold text-black dark:text-white">{item.value}</span> {unit}
              </span>
              {item.averageNote != null && (
                <span className="inline-flex items-center gap-0.5 tabular-nums">
                  <Star size={12} aria-hidden="true" className="fill-star text-star" />
                  <span className="sr-only">nota média</span>
                  {formatNote(item.averageNote)}
                </span>
              )}
            </span>
          </div>
          <span aria-hidden="true" className="block h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-meta-4">
            <span
              className="block h-full rounded-full bg-primary dark:bg-[#6577F3]"
              style={{ width: `${barWidth(item.value, max)}%` }}
            />
          </span>
        </li>
      ))}
    </ol>
  );
};
