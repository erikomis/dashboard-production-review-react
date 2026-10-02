import { ProductSortProperty } from "@/shared/types/product";

export type ProductSortOption = {
  value: string;
  label: string;
  property: ProductSortProperty;
  sort: "ASC" | "DESC";
  onlyRated?: boolean;
};

/** Opções do `<select>` de ordenação; `value` vai para a URL (`?order=`). */
export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { value: "recent", label: "Mais recentes", property: "createdAt", sort: "DESC" },
  { value: "oldest", label: "Mais antigos", property: "createdAt", sort: "ASC" },
  { value: "name-asc", label: "Nome (A–Z)", property: "name", sort: "ASC" },
  { value: "name-desc", label: "Nome (Z–A)", property: "name", sort: "DESC" },
  { value: "best", label: "Melhor avaliados", property: "averageNote", sort: "DESC", onlyRated: true },
  { value: "worst", label: "Pior avaliados", property: "averageNote", sort: "ASC", onlyRated: true },
  { value: "most-reviewed", label: "Mais avaliados", property: "totalReviews", sort: "DESC" },
];

export const DEFAULT_PRODUCT_SORT = PRODUCT_SORT_OPTIONS[0];

export const getProductSort = (value?: string | null) =>
  PRODUCT_SORT_OPTIONS.find((option) => option.value === value) ?? DEFAULT_PRODUCT_SORT;

/** Imagens importadas do Open Food Facts não passam pelo nosso armazenamento. */
export const getImageSourceLabel = (url?: string | null) => {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    if (host.endsWith("openfoodfacts.org")) return "Open Food Facts";
    return host;
  } catch {
    return null;
  }
};
