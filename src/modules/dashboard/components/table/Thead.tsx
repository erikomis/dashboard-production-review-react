type TheadProps = {
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export const Thead = ({ children, ...rest }: TheadProps) => {
  return <thead {...rest}>{children}</thead>;
};
