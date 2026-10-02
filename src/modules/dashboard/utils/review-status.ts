import { ReviewStatus } from "@/shared/types/review";

/** Abas da tela de avaliações. `REPORTED` = com denúncias abertas (qualquer status). */
export type StatusFilter = "ALL" | ReviewStatus | "REPORTED";

export const STATUS_META: Record<ReviewStatus, { label: string; color: "success" | "warning" }> = {
  VISIBLE: { label: "Visível", color: "success" },
  HIDDEN: { label: "Oculta", color: "warning" },
};

/** Status ausente (API antiga) = visível. */
export const getReviewStatusMeta = (status?: string | null) =>
  status === "HIDDEN" ? STATUS_META.HIDDEN : STATUS_META.VISIBLE;

/** Lê `?status=` da URL com segurança. */
export const parseStatusFilter = (value?: string | null): StatusFilter =>
  value === "VISIBLE" || value === "HIDDEN" || value === "REPORTED" ? value : "ALL";

/** Valor de `status` enviado para a API (`undefined` = sem filtro). */
export const statusFilterToParam = (filter: StatusFilter): ReviewStatus | undefined =>
  filter === "VISIBLE" || filter === "HIDDEN" ? filter : undefined;

/** Valor de `reported` enviado para a API. */
export const reportedFilterToParam = (filter: StatusFilter): true | undefined =>
  filter === "REPORTED" ? true : undefined;
