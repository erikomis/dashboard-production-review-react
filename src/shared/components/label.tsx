interface labelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value: string;
  /** Exibe o marcador de campo obrigatório. */
  required?: boolean;
}

export const Label = ({ value, required, className, ...props }: labelProps) => {
  return (
    <label
      className={
        className ?? "mb-2 block text-sm font-medium text-black dark:text-white"
      }
      {...props}
    >
      {value}
      {required && (
        <>
          <span aria-hidden="true" className="ml-0.5 text-danger dark:text-danger-light">
            *
          </span>
          <span className="sr-only"> (obrigatório)</span>
        </>
      )}
    </label>
  );
};
