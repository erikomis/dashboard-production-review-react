type TbodyProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLTableSectionElement>;

export const Tbody = ({ children, ...rest }: TbodyProps) => {
  return (
    <tbody {...rest}>
      {children}
    </tbody>
  );
};
