import { cn } from "@/shared/utils/utils";

type ThProps = {
  children?: React.ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>;

export const Th = ({ children, className, scope = "col", ...rest }: ThProps) => {
  return (
    <th
      scope={scope}
      {...rest}
      className={cn(
        "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-black first:pl-5 last:pr-5 dark:text-bodydark1 sm:first:pl-6 sm:last:pr-6",
        className
      )}
    >
      {children}
    </th>
  );
};
