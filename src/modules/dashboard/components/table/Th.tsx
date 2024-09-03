type ThProps = {
  children: React.ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>;

export const Th = ({ children, className, ...rest }: ThProps) => {
  return (
    <th
      {...rest}
      className={
        className
          ? className
          : "min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
      }
    >
      {children}
    </th>
  );
};
