import { apiTime, parseApiDate } from "@/shared/utils/date";

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

/** "há 5 minutos", "ontem", "agora mesmo". */
export const formatRelativeTime = (value?: string | null, now: number = Date.now()) => {
  if (!value) return "—";
  const time = apiTime(value);
  if (Number.isNaN(time)) return "—";
  const diffSeconds = Math.round((time - now) / 1000);
  const abs = Math.abs(diffSeconds);
  if (abs < 45) return "agora mesmo";
  for (const [unit, seconds] of UNITS) {
    if (abs >= seconds) return rtf.format(Math.round(diffSeconds / seconds), unit);
  }
  return rtf.format(Math.round(diffSeconds / 60), "minute");
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → `YYYY-MM-DD` no fuso local (valor de `<input type="date">`). */
export const toDateInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Hoje e `days - 1` dias atrás, como `YYYY-MM-DD`. */
export const lastDaysRange = (days: number, now: Date = new Date()) => {
  const from = new Date(now);
  from.setDate(from.getDate() - (days - 1));
  return { from: toDateInput(from), to: toDateInput(now) };
};

const dayHeading = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });

/** Rótulo do agrupamento por dia: "Hoje", "Ontem" ou "quinta-feira, 1 de outubro". */
export const dayGroupLabel = (value: string, now: Date = new Date()) => {
  const date = parseApiDate(value);
  if (!date) return "Sem data";
  const key = toDateInput(date);
  if (key === toDateInput(now)) return "Hoje";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (key === toDateInput(yesterday)) return "Ontem";
  return dayHeading.format(date);
};

/** Agrupa itens (já ordenados) pelo dia local de `getDate(item)`, mantendo a ordem. */
export const groupByDay = <T,>(items: T[], getDate: (item: T) => string, now: Date = new Date()) => {
  const groups: { key: string; label: string; items: T[] }[] = [];
  for (const item of items) {
    const raw = getDate(item);
    const parsed = parseApiDate(raw);
    const key = parsed ? toDateInput(parsed) : "invalid";
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(item);
    else groups.push({ key, label: dayGroupLabel(raw, now), items: [item] });
  }
  return groups;
};
