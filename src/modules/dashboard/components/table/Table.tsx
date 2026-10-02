import { TableDensity } from "@/shared/libs/preferences";
import { cn } from "@/shared/utils/utils";
import { TableDensityContext } from "./density";

type TableProps = {
  children: React.ReactNode;
  /** Legenda acessível (pode ficar visualmente oculta). */
  caption?: string;
  /** Cabeçalho fixo: a tabela rola dentro do cartão e o cabeçalho fica visível. */
  stickyHeader?: boolean;
  density?: TableDensity;
} & React.HTMLAttributes<HTMLTableElement>;

export const Table = ({ children, caption, stickyHeader = false, density = "comfortable", ...rest }: TableProps) => {
  return (
    <TableDensityContext.Provider value={density}>
      <div
        className={cn(
          "relative max-w-full overflow-x-auto",
          stickyHeader && "sm:max-h-[calc(100vh-13rem)] sm:overflow-y-auto sm:overscroll-contain"
        )}
        data-sticky-header={stickyHeader || undefined}
      >
        <table className="w-full table-auto text-left text-sm" {...rest}>
          {caption && <caption className="sr-only">{caption}</caption>}
          {children}
        </table>
      </div>
    </TableDensityContext.Provider>
  );
};
