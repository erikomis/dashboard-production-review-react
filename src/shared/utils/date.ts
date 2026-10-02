/**
 * Datas da API.
 *
 * Desde a fase 3 a API devolve data/hora em ISO-8601 UTC com `Z`
 * (ex.: `2026-10-02T02:14:49Z`). Exibimos sempre no fuso do navegador.
 * - Com `Z` ou offset (`-03:00`): o `Date` nativo já converte.
 * - Data/hora sem fuso: tratada como UTC (contrato da API), nunca como hora local.
 * - Só data (`YYYY-MM-DD`, ex.: `stats.date`): dia do calendário, meia-noite local
 *   (o `Date` nativo trataria como UTC e mostraria o dia anterior no Brasil).
 */
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const HAS_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

export const parseApiDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const raw = value.trim();
  const dateOnly = DATE_ONLY.exec(raw);
  let date: Date;
  if (dateOnly) {
    date = new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  } else if (HAS_TIME.test(raw) && !HAS_ZONE.test(raw)) {
    date = new Date(`${raw}Z`);
  } else {
    date = new Date(raw);
  }
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Milissegundos desde a época, ou `NaN` se a data for inválida. */
export const apiTime = (value?: string | null) => parseApiDate(value)?.getTime() ?? Number.NaN;
