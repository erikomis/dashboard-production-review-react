import { useMutation, useQuery } from "@tanstack/react-query";
import { ImportService } from "@/modules/dashboard/services/import.service";
import { queryClient } from "@/shared/libs/react-query";
import { ImportJob } from "@/shared/types/admin";

export const POLL_INTERVAL_MS = 2000;

const pollWhileRunning = (job?: ImportJob | null) =>
  job?.status === "RUNNING" ? POLL_INTERVAL_MS : false;

/** Último job (`null` = nunca rodou). Também faz polling enquanto ele estiver rodando. */
export const useQueryLatestImport = () =>
  useQuery({
    queryKey: ["import", "latest"],
    queryFn: () => ImportService.getLatest(),
    staleTime: 0,
  });

/** Job específico, consultado a cada 2 s enquanto `RUNNING`. */
export const useQueryImportJob = (id?: string | null) =>
  useQuery({
    queryKey: ["import", "job", id],
    queryFn: () => ImportService.getJob(id!),
    enabled: !!id,
    staleTime: 0,
    refetchInterval: (query) => pollWhileRunning(query.state.data),
    refetchIntervalInBackground: true,
  });

export const useMutationStartImport = () =>
  useMutation({
    mutationFn: (productsPerSubcategory: number) =>
      ImportService.startOpenFoodFacts(productsPerSubcategory),
    onSuccess: (job) => {
      queryClient.setQueryData(["import", "job", job.id], job);
      queryClient.setQueryData(["import", "latest"], job);
    },
  });

/** O catálogo mudou: tudo que depende dele é recarregado. */
export const invalidateCatalogQueries = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["products"] }),
    queryClient.invalidateQueries({ queryKey: ["categories"] }),
    queryClient.invalidateQueries({ queryKey: ["sub-categories"] }),
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
    queryClient.invalidateQueries({ queryKey: ["import", "latest"] }),
  ]);
