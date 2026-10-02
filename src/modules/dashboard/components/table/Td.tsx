import { cn } from "@/shared/utils/utils";

type TdProps = {
  children?: React.ReactNode;
  className?: string;
} & React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;

export const Td = ({ children, className, ...rest }: TdProps) => {
  return (
    <td
      {...rest}
      className={cn(
        "border-b border-stroke px-4 py-3.5 align-middle text-black first:pl-5 last:pr-5 dark:border-strokedark dark:text-bodydark1 sm:first:pl-6 sm:last:pr-6",
        className
      )}
    >
      {children}
    </td>
  );
};
