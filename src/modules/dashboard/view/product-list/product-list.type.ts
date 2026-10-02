export type ProductListFilters = {
  categoryId?: number;
  subCategorieId?: number;
  /** Valor de `PRODUCT_SORT_OPTIONS`. */
  order: string;
};
