import { tv } from "tailwind-variants";
import { cn } from "../utils/utils";

const optionsVariants = tv({
  base: "text-body dark:text-bodydark",
});

interface OptionsProps
  extends React.DetailedHTMLProps<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    HTMLOptionElement
  > {
  children?: React.ReactNode;
}

export const Options = ({ children, ...rest }: OptionsProps) => {
  return (
    <option {...rest} className={cn(optionsVariants(), rest.className)}>
      {children}
    </option>
  );
};
