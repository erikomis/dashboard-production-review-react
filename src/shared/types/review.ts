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

export type ReviewPage = Page<Review>;
