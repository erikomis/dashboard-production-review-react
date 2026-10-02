import { cn } from "@/shared/utils/utils";

type TheadProps = {
  children: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;

/** Fica fixo no topo quando a tabela usa `stickyHeader` (ver Table.Root). */
export const Thead = ({ children, className, ...rest }: TheadProps) => {
  return (
    <thead
      className={cn(
        "border-y border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4 [[data-sticky-header]_&]:sticky [[data-sticky-header]_&]:top-0 [[data-sticky-header]_&]:z-10 [[data-sticky-header]_&]:shadow-[0_1px_0_theme(colors.stroke)] dark:[[data-sticky-header]_&]:shadow-[0_1px_0_theme(colors.strokedark)]",
        className
      )}
      {...rest}
    >
      {children}
    </thead>
  );
};
