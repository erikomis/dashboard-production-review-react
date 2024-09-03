import { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../../shared/utils/utils";

type TrProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
} & React.DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >;

export const Tr = ({ children, className, ...rest }: TrProps) => {
  return (
    <tr {...rest} className={cn(className)}>
      {children}
    </tr>
  );
};
