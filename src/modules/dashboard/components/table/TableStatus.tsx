import { Skeleton } from "@/shared/components/skeleton";
import { Td } from "./Td";
import { Tr } from "./Tr";

/** Linhas "esqueleto" enquanto a lista carrega. */
export const TableLoadingRows = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, row) => (
      <Tr key={row} aria-hidden="true">
        {Array.from({ length: columns }).map((__, col) => (
          <Td key={col}>
            <Skeleton className={col === 0 ? "h-4 w-40" : "h-4 w-24"} />
          </Td>
        ))}
      </Tr>
    ))}
  </>
);

/** Linha ocupando toda a largura (estado vazio ou erro). */
export const TableMessageRow = ({ columns, children }: { columns: number; children: React.ReactNode }) => (
  <Tr>
    <Td colSpan={columns} className="border-b-0">
      {children}
    </Td>
  </Tr>
);
