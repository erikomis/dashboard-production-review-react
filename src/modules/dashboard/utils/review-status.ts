import { ReviewStatus } from "@/shared/types/review";

export type StatusFilter = "ALL" | ReviewStatus;

export const STATUS_META: Record<ReviewStatus, { label: string; color: "success" | "warning" }> = {
  VISIBLE: { label: "Visível", color: "success" },
  HIDDEN: { label: "Oculta", color: "warning" },
};

/** Status ausente (API antiga) = visível. */
export const getReviewStatusMeta = (status?: string | null) =>
  status === "HIDDEN" ? STATUS_META.HIDDEN : STATUS_META.VISIBLE;

/** Lê `?status=` da URL com segurança. */
export const parseStatusFilter = (value?: string | null): StatusFilter =>
  value === "VISIBLE" || value === "HIDDEN" ? value : "ALL";

/** Valor enviado para a API (`undefined` = sem filtro). */
export const statusFilterToParam = (filter: StatusFilter): ReviewStatus | undefined =>
  filter === "ALL" ? undefined : filter;
