import { useMutation } from "@tanstack/react-query";
import { ProductsService } from "@/modules/dashboard/services/products.service";
import { queryClient } from "@/shared/libs/react-query";

type ProductCreatePayload = { name: string; description: string };
type ProductUpdatePayload = { id: string; name?: string; description?: string };

export const useMutationCreateProduct = () =>
  useMutation({
    mutationFn: (product: ProductCreatePayload) => ProductsService.create(product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

export const useMutationUpdateProduct = () =>
  useMutation({
    mutationFn: ({ id, ...data }: ProductUpdatePayload) => ProductsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

export const useMutationDeleteProduct = () =>
  useMutation({
    mutationFn: (id: string) => ProductsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
