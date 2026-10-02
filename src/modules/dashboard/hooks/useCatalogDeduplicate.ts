import { useMutation } from "@tanstack/react-query";
import { CatalogService } from "@/modules/dashboard/services/catalog.service";
import { invalidateCatalogQueries } from "./useImportJob";

/** Remove produtos duplicados do catálogo e recarrega tudo que depende dele. */
export const useMutationDeduplicateCatalog = () =>
  useMutation({
    mutationFn: () => CatalogService.deduplicate(),
    onSuccess: () => invalidateCatalogQueries(),
  });
