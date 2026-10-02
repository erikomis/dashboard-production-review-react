import { CountPerDay, ReviewsPerDay } from "@/shared/types/admin";

export const PERIOD_OPTIONS = [7, 30, 90] as const;
export type PeriodDays = (typeof PERIOD_OPTIONS)[number];

export const parsePeriod = (value?: string | null): PeriodDays => {
  const n = Number(value);
  return (PERIOD_OPTIONS as readonly number[]).includes(n) ? (n as PeriodDays) : 30;
};

/** `2026-10-02` → Date local (sem deslocamento de fuso). */
const parseDay = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const shortDay = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });
const longDay = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short" });

/** "02/10" para o eixo. */
export const formatDayShort = (date: string) => shortDay.format(parseDay(date));
/** "qui., 02 de out." para tooltip e tabela. */
export const formatDayLong = (date: string) => longDay.format(parseDay(date));

/** Nota com 1 casa e vírgula ("4,3"); "—" quando nula. */
export const formatNote = (value?: number | null) =>
  value === null || value === undefined || Number.isNaN(value)
    ? "—"
    : value.toFixed(1).replace(".", ",");

export type RatingBucket = { note: number; count: number; percent: number };

/** `{"1":0,...,"5":2}` → lista de 5 a 1 com percentual inteiro. Chaves ausentes = 0. */
export const toRatingBuckets = (distribution?: Record<string, number> | null): RatingBucket[] => {
  const counts = [5, 4, 3, 2, 1].map((note) => ({
    note,
    count: Math.max(0, Number(distribution?.[String(note)] ?? 0) || 0),
  }));
  const total = counts.reduce((acc, b) => acc + b.count, 0);
  return counts.map((b) => ({ ...b, percent: total ? Math.round((b.count / total) * 100) : 0 }));
};

/** Soma de `count` de uma série diária. */
export const sumCounts = (series: { count: number }[] = []) =>
  series.reduce((acc, item) => acc + (item.count || 0), 0);

/** Dia com mais ocorrências (o primeiro em caso de empate); `null` se tudo for zero. */
export const peakDay = <T extends CountPerDay>(series: T[] = []): T | null =>
  series.reduce<T | null>((best, item) => (item.count > (best?.count ?? 0) ? item : best), null);

/**
 * Média ponderada pelo número de avaliações no período (dias sem avaliação ficam de fora).
 * `null` quando não há avaliações.
 */
export const weightedAverage = (series: ReviewsPerDay[] = []) => {
  let weight = 0;
  let total = 0;
  for (const day of series) {
    if (day.averageNote === null || !day.count) continue;
    weight += day.count;
    total += day.averageNote * day.count;
  }
  return weight ? Math.round((total / weight) * 10) / 10 : null;
};

/** Intervalo dos rótulos do eixo X para não amontoar (≈ 7 rótulos visíveis). */
export const tickInterval = (length: number, maxTicks = 7) =>
  length <= maxTicks ? 0 : Math.ceil(length / maxTicks) - 1;

const NICE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];

/**
 * Marcas inteiras e "redondas" do eixo Y de contagens (no máximo 5 intervalos).
 * Teto mínimo 4, para não desenhar barras gigantes com 1 item.
 */
export const niceTicks = (max: number) => {
  const top = Math.max(4, Math.ceil(max));
  const step = NICE_STEPS.find((s) => s * 5 >= top) ?? Math.ceil(top / 5);
  const intervals = Math.ceil(top / step);
  return Array.from({ length: intervals + 1 }, (_, i) => i * step);
};

/** Teto do eixo Y (última marca de `niceTicks`). */
export const niceMax = (max: number) => {
  const ticks = niceTicks(max);
  return ticks[ticks.length - 1];
};

/** Largura proporcional (0–100) para barras horizontais, relativa ao maior valor. */
export const barWidth = (value: number, max: number) =>
  max > 0 ? Math.max(value > 0 ? 2 : 0, Math.round((value / max) * 100)) : 0;

/** Cores dos gráficos por tema (validadas: contraste ≥ 3:1 e separação para daltonismo). */
export const chartTheme = (mode: "light" | "dark") =>
  mode === "dark"
    ? {
        primary: "#6577F3",
        star: "#D97706",
        grid: "#2E3A47",
        axis: "#AEB7C0",
        surface: "#24303F",
        cursor: "rgba(101, 119, 243, 0.12)",
      }
    : {
        primary: "#3C50E0",
        star: "#D97706",
        grid: "#E2E8F0",
        axis: "#5B6B82",
        surface: "#FFFFFF",
        cursor: "rgba(60, 80, 224, 0.08)",
      };

export type ChartTheme = ReturnType<typeof chartTheme>;
