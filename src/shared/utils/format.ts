const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

const parse = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value?: string | null) => {
  const date = parse(value);
  return date ? dateTimeFormatter.format(date) : "—";
};

export const formatDate = (value?: string | null) => {
  const date = parse(value);
  return date ? dateFormatter.format(date) : "—";
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

/** Iniciais para avatar ("Usuário Teste" → "UT"). */
export const initials = (name?: string | null) =>
  (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
