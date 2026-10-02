import { Page } from "./api";

export type ReviewStatus = "VISIBLE" | "HIDDEN";

export interface Review {
  id: number;
  title: string;
  description: string;
  note: number;
  productId: number;
  userId: number;
  createdAt?: string;
  /** Preenchido na listagem; pode vir `null` em `GET /review/{id}`. */
  productName?: string | null;
  productSlug?: string | null;
  userName?: string | null;
  helpfulCount?: number;
  helpfulByMe?: boolean;
  status?: ReviewStatus;
  moderationReason?: string | null;
  moderatedAt?: string | null;
  /** Só em `/admin/reviews`. */
  moderatedByName?: string | null;
  /** Username do autor, para linkar o perfil público no site. */
  userUsername?: string | null;
  /** Fotos enviadas pelo autor (url relativa à API: `/api/v1/files/...`). */
  images?: ReviewImage[];
  /** Resposta oficial da equipe, ou `null`. */
  reply?: ReviewReply | null;
  /** Denúncias abertas. Só vem preenchido em `/admin/reviews` (nas outras listas é 0). */
  reportsCount?: number;
  reportedByMe?: boolean;
}

export interface ReviewImage {
  id: number;
  url: string;
}

export interface ReviewReply {
  text: string;
  authorName: string | null;
  repliedAt: string;
}

export type ReportReason = "SPAM" | "OFFENSIVE" | "FALSE_INFORMATION" | "OTHER";

/** Denúncia de uma avaliação (`GET /admin/reviews/{id}/reports`). */
export interface ReviewReport {
  id: number;
  reason: ReportReason | string;
  details: string | null;
  reporterName: string | null;
  createdAt: string;
}

export interface ReviewPayload {
  title: string;
  description: string;
  note: number;
  productId: number;
}

export interface ModerationPayload {
  status: ReviewStatus;
  reason?: string;
}

export interface BulkModerationPayload extends ModerationPayload {
  /** 1 a 100 ids; inexistentes são ignorados pela API. */
  ids: number[];
}

export interface BulkModerationResult {
  updated: number;
}

export type ReviewPage = Page<Review>;
