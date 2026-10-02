import { Page } from "./api";

export interface Review {
  id: number;
  title: string;
  description: string;
  note: number;
  productId: number;
  userId: number;
  createdAt?: string;
  /** Preenchido na listagem; vem `null` em `GET /review/{id}`. */
  productName?: string | null;
  userName?: string | null;
}

export interface ReviewPayload {
  title: string;
  description: string;
  note: number;
  productId: number;
}

export type ReviewPage = Page<Review>;
