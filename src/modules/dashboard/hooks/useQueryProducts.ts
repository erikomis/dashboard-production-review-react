import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "../services/products.service";

export const useQueryProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: () => ProductsService.fetchProducts(),
  });
