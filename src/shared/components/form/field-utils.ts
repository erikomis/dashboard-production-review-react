export const fieldIds = (id: string) => ({
  hintId: `${id}-hint`,
  errorId: `${id}-error`,
});

/** Monta `aria-describedby` só com os ids que realmente existem. */
export const describedBy = (id: string, hint?: React.ReactNode, error?: string) => {
  const { hintId, errorId } = fieldIds(id);
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
};

export const fieldBaseClass =
  "w-full rounded-lg border bg-transparent px-4 py-3 text-black outline-none transition placeholder:text-body/80 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:bg-whiter dark:bg-form-input dark:text-white dark:placeholder:text-bodydark/70 dark:focus:border-primary";

export const fieldBorderClass = (hasError?: boolean) =>
  hasError
    ? "border-danger dark:border-danger-light"
    : "border-stroke dark:border-form-strokedark";
