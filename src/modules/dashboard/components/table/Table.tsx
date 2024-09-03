type TableProps   = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLTableElement>;

export const Table = ({ children, ...rest }: TableProps) => {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto" {...rest}>{children}</table>
    </div>
  );
};
