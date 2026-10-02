type TableProps = {
  children: React.ReactNode;
  /** Legenda acessível (pode ficar visualmente oculta). */
  caption?: string;
} & React.HTMLAttributes<HTMLTableElement>;

export const Table = ({ children, caption, ...rest }: TableProps) => {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full table-auto text-left text-sm" {...rest}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
};
