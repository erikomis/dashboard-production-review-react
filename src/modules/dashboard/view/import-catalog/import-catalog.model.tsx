import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  invalidateCatalogQueries,
  useMutationStartImport,
  useQueryImportJob,
  useQueryLatestImport,
} from "@/modules/dashboard/hooks/useImportJob";
import { useMutationDeduplicateCatalog } from "@/modules/dashboard/hooks/useCatalogDeduplicate";
import { DeduplicationResult } from "@/shared/types/admin";
import {
  elapsedSeconds,
  estimateRemainingSeconds,
  getImportStatusMeta,
  importProgressPercent,
  importSummaryText,
  isImportRunning,
  SECONDS_PER_STEP,
} from "@/modules/dashboard/utils/import-progress";
import { getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { IMPORT_DEFAULT, IMPORT_MAX, IMPORT_MIN, importCatalogSchema } from "./import-catalog.schema";
import { IMPORT_STEPS, IMPORT_TAXONOMY, ImportCatalogValues } from "./import-catalog.type";

export const useImportCatalogModel = () => {
  const latest = useQueryLatestImport();
  const [startedJobId, setStartedJobId] = useState<string | null>(null);
  const jobId = startedJobId ?? latest.data?.id ?? null;
  const jobQuery = useQueryImportJob(jobId);
  const job = jobQuery.data ?? latest.data ?? null;
  const running = isImportRunning(job);

  const { mutateAsync: startImport, isPending: isStarting } = useMutationStartImport();
  const [startAnnouncement, setStartAnnouncement] = useState("");
  // Viu o job rodando nesta tela? (padrão "estado anterior" em render, sem efeito)
  const [sawRunning, setSawRunning] = useState(false);
  if (running && !sawRunning) setSawRunning(true);

  const form = useForm<ImportCatalogValues>({
    resolver: zodResolver(importCatalogSchema),
    defaultValues: { productsPerSubcategory: IMPORT_DEFAULT },
  });
  const perSubcategory = Number(useWatch({ control: form.control, name: "productsPerSubcategory" })) || 0;

  // Relógio para "tempo decorrido" enquanto roda
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  // RUNNING → COMPLETED/FAILED nesta sessão: recarrega o catálogo e avisa
  const previousStatus = useRef<string | undefined>(undefined);
  useEffect(() => {
    const status = job?.status;
    if (previousStatus.current === "RUNNING" && status && status !== "RUNNING" && job) {
      void invalidateCatalogQueries();
      if (status === "COMPLETED") toast.success(`Importação concluída: ${importSummaryText(job)}.`);
      else toast.error("A importação falhou. Veja os erros na tela.");
    }
    previousStatus.current = status;
  }, [job]);

  const announcement =
    sawRunning && job && !running
      ? `${job.status === "COMPLETED" ? "Importação concluída" : "A importação falhou"}. ${importSummaryText(job)}.`
      : startAnnouncement;

  const onSubmit = form.handleSubmit(async ({ productsPerSubcategory }) => {
    try {
      const created = await startImport(productsPerSubcategory);
      setStartedJobId(created.id);
      setStartAnnouncement("Importação iniciada. O progresso é atualizado a cada 2 segundos.");
      toast.info("Importação iniciada.");
    } catch (error) {
      if (getErrorStatus(error) === 409) {
        toast.warning("Já existe uma importação em andamento. Acompanhe o progresso abaixo.");
        const refreshed = await latest.refetch();
        if (refreshed.data?.id) setStartedJobId(refreshed.data.id);
        return;
      }
      toast.error(getErrorMessage(error, "Não foi possível iniciar a importação."));
    }
  });

  // ---- remover duplicados ----
  const { mutateAsync: deduplicate, isPending: isDeduplicating } = useMutationDeduplicateCatalog();
  const [dedupeConfirmOpen, setDedupeConfirmOpen] = useState(false);
  const [dedupeResult, setDedupeResult] = useState<DeduplicationResult | null>(null);
  const [dedupeAnnouncement, setDedupeAnnouncement] = useState("");
  const runDeduplicate = async () => {
    try {
      const result = await deduplicate();
      setDedupeResult(result);
      const message =
        result.removed === 0
          ? "Nenhum produto duplicado para remover."
          : `${result.removed} ${result.removed === 1 ? "produto duplicado removido" : "produtos duplicados removidos"} em ${result.groups} ${result.groups === 1 ? "grupo" : "grupos"}.`;
      toast.success(message);
      setDedupeAnnouncement(message);
      setDedupeConfirmOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível remover os duplicados."));
    }
  };

  const isLoadingLatest = latest.isLoading;
  const loadError = latest.isError ? getErrorMessage(latest.error, "Não foi possível consultar a última importação.") : null;

  return {
    taxonomy: IMPORT_TAXONOMY,
    totalSteps: IMPORT_STEPS,
    min: IMPORT_MIN,
    max: IMPORT_MAX,
    perSubcategory,
    maxProducts: perSubcategory * IMPORT_STEPS,
    estimatedSeconds: Math.ceil(IMPORT_STEPS * SECONDS_PER_STEP),
    field: form.register("productsPerSubcategory"),
    fieldError: form.formState.errors.productsPerSubcategory?.message,
    onSubmit,
    isStarting,
    job,
    running,
    statusMeta: job ? getImportStatusMeta(job.status) : null,
    percent: importProgressPercent(job),
    elapsed: job ? elapsedSeconds(job.startedAt, job.finishedAt, now) : 0,
    remaining: estimateRemainingSeconds(job),
    summary: job && !running ? importSummaryText(job) : null,
    isLoadingLatest,
    loadError,
    retryLatest: () => void latest.refetch(),
    announcement,
    // duplicados
    dedupeResult,
    dedupeAnnouncement,
    isDeduplicating,
    dedupeConfirmOpen,
    requestDeduplicate: () => setDedupeConfirmOpen(true),
    cancelDeduplicate: () => {
      if (!isDeduplicating) setDedupeConfirmOpen(false);
    },
    confirmDeduplicate: () => void runDeduplicate(),
  };
};
