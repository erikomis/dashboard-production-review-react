import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FolderTree,
  ImageIcon,
  Info,
  Package,
  SkipForward,
  Tags,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { Card } from "@/modules/dashboard/components/card/Card";
import { formatDuration } from "@/modules/dashboard/utils/import-progress";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Skeleton } from "@/shared/components/skeleton";
import { formatDateTime } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useImportCatalogModel } from "./import-catalog.model";
import { DeduplicateCard } from "./DeduplicateCard";

type ImportCatalogViewProps = ReturnType<typeof useImportCatalogModel>;

const Counter = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="rounded-lg border border-stroke px-3 py-2.5 dark:border-strokedark">
    <dt className="flex items-center gap-1.5 text-xs text-body dark:text-bodydark">
      <span aria-hidden="true">{icon}</span>
      {label}
    </dt>
    <dd className="mt-0.5 text-title-xsm font-bold tabular-nums text-black dark:text-white">{value}</dd>
  </div>
);

export const ImportCatalogView = (props: ImportCatalogViewProps) => {
  const {
    taxonomy,
    totalSteps,
    min,
    max,
    perSubcategory,
    maxProducts,
    estimatedSeconds,
    field,
    fieldError,
    onSubmit,
    isStarting,
    job,
    running,
    statusMeta,
    percent,
    elapsed,
    remaining,
    summary,
    isLoadingLatest,
    loadError,
    retryLatest,
    announcement,
  } = props;
  return (
    <>
      <PageHeader
        title="Importar catálogo"
        description="Traga produtos reais do Open Food Facts para o catálogo, com foto, marca e Nutri-Score."
        breadcrumbs={[{ label: "Catálogo" }, { label: "Importar" }]}
      />

      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card
            title="Nova importação"
            titleId="import-form-title"
            description="A importação é idempotente: o que já existe (mesmo slug) é reaproveitado, nunca duplicado."
          >
            <form onSubmit={onSubmit} noValidate aria-labelledby="import-form-title">
              <div className="flex flex-col gap-x-6 sm:flex-row sm:items-start">
                <div className="sm:w-64">
                  <Input
                    id="products-per-subcategory"
                    type="number"
                    inputMode="numeric"
                    min={min}
                    max={max}
                    step={1}
                    error={fieldError}
                    hint={`De ${min} a ${max}. Padrão: 12.`}
                    disabled={running || isStarting}
                    {...field}
                  >
                    <Label htmlFor="products-per-subcategory" value="Produtos por subcategoria" required />
                  </Input>
                </div>
                <dl className="mb-4 grid flex-1 grid-cols-2 gap-3 text-sm sm:mt-7">
                  <div className="rounded-lg bg-gray-2 px-3 py-2 dark:bg-meta-4">
                    <dt className="text-xs text-body dark:text-bodydark">Até</dt>
                    <dd className="font-semibold text-black dark:text-white">
                      {maxProducts > 0 ? `${maxProducts} produtos` : "—"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-gray-2 px-3 py-2 dark:bg-meta-4">
                    <dt className="text-xs text-body dark:text-bodydark">Duração estimada</dt>
                    <dd className="font-semibold text-black dark:text-white">≈ {formatDuration(estimatedSeconds)}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  isLoading={isStarting}
                  disabled={running}
                  leftIcon={<Download size={18} aria-hidden="true" />}
                >
                  {isStarting ? "Iniciando..." : running ? "Importação em andamento" : "Iniciar importação"}
                </Button>
                <p className="text-xs text-body dark:text-bodydark">
                  {totalSteps} buscas ({perSubcategory > 0 ? `${perSubcategory} por subcategoria` : "—"}), com pausa de
                  6,5 s entre elas por causa do limite do Open Food Facts. Se o serviço deles pedir uma pausa, cada
                  busca é repetida uma vez após 15 s e a importação demora mais.
                </p>
              </div>
            </form>
          </Card>

          <Card
            title="Progresso"
            titleId="import-progress-title"
            description={
              job ? `Importação iniciada por ${job.startedBy ?? "—"} em ${formatDateTime(job.startedAt)}` : undefined
            }
            actions={statusMeta ? <Badge color={statusMeta.color}>{statusMeta.label}</Badge> : undefined}
          >
            {isLoadingLatest ? (
              <div className="space-y-3" aria-hidden="true">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : loadError ? (
              <ErrorState
                title="Não foi possível consultar a importação"
                description={loadError}
                onRetry={retryLatest}
              />
            ) : !job ? (
              <p className="flex items-center gap-2 py-4 text-sm text-body dark:text-bodydark">
                <Info size={18} aria-hidden="true" />
                Nenhuma importação foi feita ainda. Escolha a quantidade e clique em “Iniciar importação”.
              </p>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                    <span id="import-step-label" className="min-w-0 font-medium text-black dark:text-white">
                      {running ? (
                        <>
                          Passo {Math.min(job.completedSteps + 1, job.totalSteps)} de {job.totalSteps}
                          {job.currentStep && (
                            <span className="font-normal text-body dark:text-bodydark"> · {job.currentStep}</span>
                          )}
                        </>
                      ) : job.status === "COMPLETED" ? (
                        "Todos os passos concluídos"
                      ) : (
                        `Interrompida no passo ${job.completedSteps} de ${job.totalSteps}`
                      )}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-black dark:text-white">{percent}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-labelledby="import-progress-title"
                    aria-describedby="import-step-label"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    aria-valuetext={`${job.completedSteps} de ${job.totalSteps} passos (${percent}%)`}
                    className="h-3 overflow-hidden rounded-full bg-gray-2 dark:bg-meta-4"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                        job.status === "FAILED"
                          ? "bg-danger"
                          : job.status === "COMPLETED"
                            ? "bg-success"
                            : "bg-primary",
                        running &&
                          "bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.18)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.18)_50%,rgba(255,255,255,.18)_75%,transparent_75%)]",
                      )}
                      style={{ width: `${Math.max(percent, running ? 2 : 0)}%` }}
                    />
                  </div>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body dark:text-bodydark">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} aria-hidden="true" />
                      {running ? "Decorrido" : "Duração"}: {formatDuration(elapsed)}
                    </span>
                    {remaining !== null && <span>Restante estimado: ≈ {formatDuration(remaining)}</span>}
                    {running && <span>Atualiza a cada 2 s</span>}
                  </p>
                </div>

                <dl
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                  aria-label="Contadores da importação"
                >
                  <Counter icon={<Package size={14} />} label="Produtos criados" value={job.productsCreated} />
                  <Counter icon={<SkipForward size={14} />} label="Já existiam" value={job.productsSkipped} />
                  <Counter icon={<ImageIcon size={14} />} label="Imagens" value={job.imagesCreated} />
                  <Counter icon={<Tags size={14} />} label="Categorias novas" value={job.categoriesCreated} />
                  <Counter
                    icon={<FolderTree size={14} />}
                    label="Subcategorias novas"
                    value={job.subCategoriesCreated}
                  />
                </dl>

                {job.errors?.length > 0 && (
                  <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 dark:bg-warning/10">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-warning-dark dark:text-warning">
                      <AlertTriangle size={16} aria-hidden="true" />
                      {job.errors.length} {job.errors.length === 1 ? "passo com erro" : "passos com erro"}
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black dark:text-bodydark1">
                      {job.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-body dark:text-bodydark">
                      Rode a importação de novo para tentar só o que faltou: o que já existe é pulado.
                    </p>
                  </div>
                )}

                {!running && summary && (
                  <div
                    className={cn(
                      "rounded-lg border p-4",
                      job.status === "COMPLETED"
                        ? "border-success/40 bg-success/5 dark:bg-success/10"
                        : "border-danger/40 bg-danger/5 dark:bg-danger/10",
                    )}
                  >
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                      {job.status === "COMPLETED" ? (
                        <CheckCircle2
                          size={18}
                          aria-hidden="true"
                          className="text-success-dark dark:text-success-light"
                        />
                      ) : (
                        <XCircle size={18} aria-hidden="true" className="text-danger dark:text-danger-light" />
                      )}
                      {job.status === "COMPLETED" ? "Resumo da importação" : "A importação falhou"}
                    </h3>
                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                      {summary}
                      {job.finishedAt && <> · terminou em {formatDateTime(job.finishedAt)}</>}.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link to="/dashboard/products?order=recent" className={buttonVariants({ size: "sm" })}>
                        Ver produtos
                      </Link>
                      <Link to="/dashboard/categories" className={buttonVariants({ size: "sm", color: "outline" })}>
                        Categorias
                      </Link>
                      <Link to="/dashboard/sub-categories" className={buttonVariants({ size: "sm", color: "outline" })}>
                        Subcategorias
                      </Link>
                      <Link to="/dashboard/home" className={buttonVariants({ size: "sm", color: "ghost" })}>
                        Visão geral
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <DeduplicateCard {...props} />

          <Card title="Sobre a fonte" titleId="import-source-title">
            <div className="space-y-3 text-sm text-body dark:text-bodydark">
              <p>
                O{" "}
                <a
                  href="https://world.openfoodfacts.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline dark:text-primary-light"
                >
                  Open Food Facts
                  <ExternalLink size={12} aria-hidden="true" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>{" "}
                é uma base colaborativa e aberta de alimentos. Usamos a API pública oficial (não é raspagem de páginas),
                buscando produtos vendidos no Brasil, dos mais escaneados para os menos.
              </p>
              <p>
                Os dados são licenciados sob a{" "}
                <a
                  href="https://opendatacommons.org/licenses/odbl/1-0/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary hover:underline dark:text-primary-light"
                >
                  Open Database License (ODbL)
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                : podem ser usados livremente, desde que a fonte seja citada e melhorias na base sejam compartilhadas
                sob a mesma licença. As fotos seguem a licença de cada colaborador (CC BY-SA).
              </p>
              <p>
                Cada produto vem com nome, foto, marca, quantidade e Nutri-Score. Produtos sem nome ou sem foto são
                ignorados. As fotos ficam hospedadas no próprio Open Food Facts.
              </p>
            </div>
          </Card>

          <Card
            title="O que será importado"
            titleId="import-taxonomy-title"
            description={`${taxonomy.length} categorias e ${totalSteps} subcategorias.`}
          >
            <ul className="space-y-4">
              {taxonomy.map((category) => (
                <li key={category.slug}>
                  <p className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
                    <Tags size={14} aria-hidden="true" className="text-primary dark:text-primary-light" />
                    {category.name}
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5 pl-6">
                    {category.subCategories.map((sub) => (
                      <li key={sub.slug}>
                        <Badge color="neutral" title={`Tag no Open Food Facts: ${sub.tag}`}>
                          {sub.name}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
};
