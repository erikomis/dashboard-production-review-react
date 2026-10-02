import { z } from "zod";
import { hideReviewSchema, replySchema } from "./review-list.schema";

export type HideReviewValues = z.infer<typeof hideReviewSchema>;
export type ReplyValues = z.infer<typeof replySchema>;

/**
 * Ocultar/restaurar: uma avaliação (`bulk: false`, usa a rota individual)
 * ou várias selecionadas (`bulk: true`, usa `PATCH /admin/reviews/moderation`).
 */
export type ModerationTarget = {
  action: "hide" | "restore";
  ids: number[];
  bulk: boolean;
  /** Título (uma avaliação). */
  title?: string;
  /** Denúncias abertas que serão resolvidas ao ocultar. */
  reportsCount?: number;
};

/** Painel lateral: abre focado nas denúncias, na resposta ou só nos detalhes. */
export type DetailFocus = "details" | "reports" | "reply";

export type PendingConfirm =
  | { kind: "dismiss-reports"; reviewId: number; title: string; count: number }
  | { kind: "delete-reply"; reviewId: number; title: string }
  | { kind: "delete-image"; reviewId: number; imageId: number; title: string };
