interface labelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value: string;
}

export const Label = ({ value, ...props }: labelProps) => {
  return (
    <label
      className="block mb-2 font-medium text-black dark:text-white"
      {...props}
    >
      {value}
    </label>
  );
};
