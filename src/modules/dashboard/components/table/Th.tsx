import { cn } from "@/shared/utils/utils";
import { useTableDensity } from "./density";

type ThProps = {
  children?: React.ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>;

export const Th = ({ children, className, scope = "col", ...rest }: ThProps) => {
  const density = useTableDensity();
  return (
    <th
      scope={scope}
      {...rest}
      className={cn(
        "whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-wide text-black first:pl-5 last:pr-5 dark:text-bodydark1 sm:first:pl-6 sm:last:pr-6",
        density === "compact" ? "py-2.5" : "py-3",
        className
      )}
    >
      {children}
    </th>
  );
};
