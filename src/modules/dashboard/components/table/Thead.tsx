type TheadProps = {
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export const Thead = ({ children, ...rest }: TheadProps) => {
  return (
    <thead className="border-y border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4" {...rest}>
      {children}
    </thead>
  );
};
