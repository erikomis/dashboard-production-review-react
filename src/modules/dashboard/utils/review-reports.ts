import { ReviewReport } from "@/shared/types/review";

export type ReportReasonMeta = { label: string; description: string };

const REASONS: Record<string, ReportReasonMeta> = {
  SPAM: { label: "Spam", description: "Propaganda, links ou conteúdo repetido" },
  OFFENSIVE: { label: "Ofensiva", description: "Linguagem ofensiva, assédio ou discurso de ódio" },
  FALSE_INFORMATION: { label: "Informação falsa", description: "Afirmações enganosas sobre o produto" },
  OTHER: { label: "Outro motivo", description: "Motivo descrito pelo usuário" },
};

export const getReportReasonMeta = (reason?: string | null): ReportReasonMeta =>
  (reason && REASONS[reason]) || REASONS.OTHER;

/** "1 denúncia" / "3 denúncias". */
export const reportsLabel = (count: number) => `${count} ${count === 1 ? "denúncia" : "denúncias"}`;

/** Motivos agrupados, do mais frequente para o menos frequente. */
export const groupReportReasons = (reports: Pick<ReviewReport, "reason">[]) => {
  const counts = new Map<string, number>();
  for (const report of reports) counts.set(report.reason, (counts.get(report.reason) ?? 0) + 1);
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count, label: getReportReasonMeta(reason).label }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "pt-BR"));
};

/** Motivo sugerido ao ocultar uma avaliação denunciada (o admin pode editar). */
export const suggestedHideReason = (reports: Pick<ReviewReport, "reason">[]) => {
  const [top] = groupReportReasons(reports);
  if (!top) return "";
  const motive = top.reason === "OTHER" ? "denúncias da comunidade" : top.label.toLowerCase();
  return `Ocultada após ${reportsLabel(reports.length)} (${motive}).`;
};

/** Motivos rápidos no modal de ocultar. */
export const QUICK_HIDE_REASONS = [
  "Spam ou propaganda",
  "Linguagem ofensiva",
  "Informação falsa sobre o produto",
  "Conteúdo fora do tema",
];
