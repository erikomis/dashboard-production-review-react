import { Page } from "./api";
import { SubCategory } from "./category";

export interface ProductImage {
  id: number;
  productId: number;
  urlImage: string;
  type: string;
  filename: string;
}

/** Item da listagem paginada (`/production/list`). */
export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  subCategorie?: SubCategory | null;
  subCategorieId: number;
  productImages?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

/** Detalhe (`/production/{id}`). */
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  subCategorieId: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  slug: string;
  subCategorieId: number;
}

export type ProductPage = Page<Product>;
