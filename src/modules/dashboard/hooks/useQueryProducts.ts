import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/dashboard/services/products.service";

export const useQueryProducts = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["products", page, size],
    queryFn: () => ProductsService.fetchProducts(page, size),
  });
