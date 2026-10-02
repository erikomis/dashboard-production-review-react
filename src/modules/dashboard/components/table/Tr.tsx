import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/utils";

type TrProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
  /** Destaque ao passar o mouse (linhas de dados). */
  hover?: boolean;
};

export const Tr = ({ children, className, hover = false, ...rest }: TrProps) => {
  return (
    <tr
      {...rest}
      className={cn(hover && "transition-colors hover:bg-gray-2 dark:hover:bg-meta-4/60", className)}
    >
      {children}
    </tr>
  );
};
