import { useMutation } from "@tanstack/react-query";
import { ProductsService } from "@/modules/dashboard/services/products.service";
import { queryClient } from "@/shared/libs/react-query";
import { ProductPayload } from "@/shared/types/product";

type ProductUpdatePayload = ProductPayload & { id: number | string };

const invalidate = () => queryClient.invalidateQueries({ queryKey: ["products"] });

export const useMutationCreateProduct = () =>
  useMutation({
    mutationFn: (product: ProductPayload) => ProductsService.create(product),
    onSuccess: invalidate,
  });

export const useMutationUpdateProduct = () =>
  useMutation({
    mutationFn: ({ id, ...data }: ProductUpdatePayload) => ProductsService.update(id, data),
    onSuccess: invalidate,
  });

export const useMutationDeleteProduct = () =>
  useMutation({
    mutationFn: (id: number | string) => ProductsService.delete(id),
    onSuccess: invalidate,
  });

export const useMutationUploadProductImage = () =>
  useMutation({
    mutationFn: ({ productId, file }: { productId: number | string; file: File }) =>
      ProductsService.uploadImage(productId, file),
    onSuccess: invalidate,
  });
