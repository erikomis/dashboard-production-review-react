import { useQueryProducts } from "./useQueryProducts";

/** Máximo permitido pela API por página. */
const MAX_OPTIONS = 100;

/** Produtos para o `<select>` da avaliação, em ordem alfabética. */
export const useProductOptions = () => {
  const { data, isLoading, isError } = useQueryProducts({
    page: 0,
    size: MAX_OPTIONS,
    property: "name",
    sort: "ASC",
  });
  return {
    products: data?.content ?? [],
    isTruncated: (data?.page.totalElements ?? 0) > MAX_OPTIONS,
    isLoading,
    isError,
    isReady: !!data,
  };
};
