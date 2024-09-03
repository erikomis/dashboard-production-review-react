type TdProps = {
  children: React.ReactNode;
  className?: string;
} & React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>

export const Td = ({ children, className, ...rest}: TdProps) => {
  return (
    <td {...rest}
      className={
        className
          ? className
          : "border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
      }
    >
      {children}
    </td>
  );
};
