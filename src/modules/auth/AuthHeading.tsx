type AuthHeadingProps = { title: string; subtitle?: string };

export const AuthHeading = ({ title, subtitle }: AuthHeadingProps) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold text-black dark:text-white sm:text-title-lg">{title}</h1>
    {subtitle && <p className="mt-2 text-body dark:text-bodydark">{subtitle}</p>}
  </div>
);
