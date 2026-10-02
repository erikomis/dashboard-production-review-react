import { apiTime } from "@/shared/utils/date";
import { ImportJob, ImportStatus } from "@/shared/types/admin";

/** Percentual inteiro 0–100, seguro contra divisão por zero e valores fora da faixa. */
export const importProgressPercent = (job?: Pick<ImportJob, "completedSteps" | "totalSteps" | "status"> | null) => {
  if (!job) return 0;
  if (job.status === "COMPLETED") return 100;
  if (!job.totalSteps || job.totalSteps <= 0) return 0;
  const ratio = job.completedSteps / job.totalSteps;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
};

export const isImportRunning = (job?: Pick<ImportJob, "status"> | null) => job?.status === "RUNNING";

export const IMPORT_STATUS_META: Record<
  ImportStatus,
  { label: string; color: "primary" | "success" | "danger" }
> = {
  RUNNING: { label: "Em andamento", color: "primary" },
  COMPLETED: { label: "Concluída", color: "success" },
  FAILED: { label: "Falhou", color: "danger" },
};

export const getImportStatusMeta = (status?: string | null) =>
  IMPORT_STATUS_META[(status as ImportStatus) ?? "RUNNING"] ?? {
    label: status ?? "—",
    color: "primary" as const,
  };

/** Intervalo mínimo entre buscas no Open Food Facts (limite deles: ~10/min). */
export const SECONDS_PER_STEP = 6.5;

/** Estimativa de segundos restantes (arredondada para cima), `null` se não estiver rodando. */
export const estimateRemainingSeconds = (
  job?: Pick<ImportJob, "completedSteps" | "totalSteps" | "status"> | null
) => {
  if (!job || job.status !== "RUNNING" || !job.totalSteps) return null;
  const remaining = Math.max(0, job.totalSteps - job.completedSteps);
  return Math.ceil(remaining * SECONDS_PER_STEP);
};

/** "1 min 20 s", "45 s". */
export const formatDuration = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds));
  const min = Math.floor(s / 60);
  const rest = s % 60;
  if (min === 0) return `${rest} s`;
  return rest === 0 ? `${min} min` : `${min} min ${rest} s`;
};

/** Duração entre início e fim (ou agora), em segundos. */
export const elapsedSeconds = (startedAt?: string | null, finishedAt?: string | null, now = Date.now()) => {
  if (!startedAt) return 0;
  const start = apiTime(startedAt);
  const end = finishedAt ? apiTime(finishedAt) : now;
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / 1000));
};

/** Texto curto do resultado, usado no anúncio `aria-live` e no resumo. */
export const importSummaryText = (job: ImportJob) => {
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  const parts = [
    plural(job.productsCreated, "produto criado", "produtos criados"),
    plural(job.productsSkipped, "ignorado", "ignorados"),
    plural(job.categoriesCreated, "categoria nova", "categorias novas"),
    plural(job.subCategoriesCreated, "subcategoria nova", "subcategorias novas"),
  ];
  const errors = job.errors?.length ?? 0;
  if (errors > 0) parts.push(plural(errors, "erro", "erros"));
  return parts.join(", ");
};
