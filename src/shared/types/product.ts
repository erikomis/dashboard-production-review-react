export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
