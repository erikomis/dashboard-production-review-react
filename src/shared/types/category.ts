export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  category?: Pick<Category, "id" | "name">;
}
