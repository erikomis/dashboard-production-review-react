import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/dashboard/services/products.service";

export const SUGGEST_MIN_CHARS = 2;

/** Autocompletar de produtos. Só consulta com 2+ caracteres (a API devolve 400 abaixo disso). */
export const useQueryProductSuggest = (query: string, limit = 6) => {
  const q = query.trim();
  return useQuery({
    queryKey: ["products", "suggest", q.toLowerCase(), limit],
    queryFn: () => ProductsService.suggest(q, limit),
    enabled: q.length >= SUGGEST_MIN_CHARS,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};
