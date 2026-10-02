import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ProductListParams,
  ProductsService,
} from "@/modules/dashboard/services/products.service";

export const useQueryProducts = (params: ProductListParams = {}) =>
  useQuery({
    queryKey: ["products", "list", params],
    queryFn: () => ProductsService.fetchProducts(params),
    placeholderData: keepPreviousData,
  });

export const useQueryProductById = (id?: string) =>
  useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => ProductsService.getById(id!),
    enabled: !!id,
    staleTime: 0,
  });
