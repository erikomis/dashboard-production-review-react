export const Loading = ({ label = "Carregando..." }: { label?: string }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-screen flex-col items-center justify-center gap-4 bg-whiten dark:bg-boxdark-2"
    >
      <div
        aria-hidden="true"
        className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
      />
      <span className="text-sm text-body dark:text-bodydark">{label}</span>
    </div>
  );
};
