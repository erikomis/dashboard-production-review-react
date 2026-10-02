export interface SubCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  categorieId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  subCategories?: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
  slug: string;
}

export interface SubCategoryPayload extends CategoryPayload {
  categorieId: number;
}
