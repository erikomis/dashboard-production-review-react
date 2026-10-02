import { Page } from "./api";

/** Imagem devolvida no upload (`POST /production/file`). */
export interface ProductImage {
  id: number;
  productId: number;
  urlImage: string;
  type: string;
  filename: string;
}

/** Imagem resumida que vem no detalhe do produto (`images[]`). */
export interface ProductDetailImage {
  id: number;
  urlImage: string;
}

/**
 * Item da listagem paginada (`/production/list`).
 * Nota e total consideram só avaliações visíveis; `averageNote` é `null` sem avaliações.
 */
export interface ProductSummary {
  id: number;
  name: string;
  description: string;
  slug: string;
  subCategorieId: number;
  subCategorieName: string | null;
  categoryId: number | null;
  categoryName: string | null;
  imageUrl: string | null;
  averageNote: number | null;
  totalReviews: number;
  createdAt?: string;
}

/** Mantido como alias: telas antigas importam `Product`. */
export type Product = ProductSummary;

/** Detalhe (`/production/{id}` e `/production/slug/{slug}`). */
export interface ProductDetail extends ProductSummary {
  images: ProductDetailImage[];
}

export interface ProductPayload {
  name: string;
  description: string;
  slug: string;
  subCategorieId: number;
}

/** Campos aceitos em `property` para ordenar a listagem. */
export type ProductSortProperty = "name" | "createdAt" | "averageNote" | "totalReviews";

export type ProductPage = Page<ProductSummary>;
