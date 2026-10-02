import { Link } from "react-router-dom";
import { ArrowUpRight, FilterX, History, ServerCrash } from "lucide-react";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { Card } from "@/modules/dashboard/components/card/Card";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { SearchInput } from "@/modules/dashboard/components/form/SearchInput";
import { FilterInput, FilterSelect } from "@/modules/dashboard/components/form/FilterSelect";
import { ChartCard } from "@/modules/dashboard/components/chart/ChartCard";
import { DailyBarChart } from "@/modules/dashboard/components/chart/DailyCharts";
import { EventIcon } from "@/modules/dashboard/components/activity/EventIcon";
import { formatDayLong } from "@/modules/dashboard/utils/chart-data";
import { formatRelativeTime } from "@/modules/dashboard/utils/relative-time";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Skeleton } from "@/shared/components/skeleton";
import { formatDateTime, formatNumber } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useActivityModel } from "./activity.model";

type ActivityViewProps = ReturnType<typeof useActivityModel>;

const QUICK_PERIODS = [7, 30, 90, 365];

export const ActivityView = ({
  groups,
  entriesCount,
  page,
  setPage,
  pageSize,
  totalPages,
  totalElements,
  type,
  setType,
  toggleType,
  typeGroups,
  entityType,
  setEntityType,
  entityOptions,
  searchInput,
  setSearchInput,
  search,
  periodDraft,
  periodError,
  setPeriodField,
  setQuickPeriod,
  hasFilters,
  clearFilters,
  summaryTotal,
  byType,
  byDay,
  byDayPeak,
  theme,
  isLoading,
  isFetching,
  isSummaryLoading,
  isError,
  isUnavailable,
  errorMessage,
  retry,
}: ActivityViewProps) => {
  const periodText = `de ${formatDayLong(periodDraft.from)} a ${formatDayLong(periodDraft.to)}`;

  return (
    <>
      <PageHeader
        title="Atividade"
        description="Trilha de auditoria: tudo o que acontece no catálogo, nas avaliações e nas contas, em ordem cronológica."
        breadcrumbs={[{ label: "Sistema" }, { label: "Atividade" }]}
      />

      {/* Filtros: uma linha acima de tudo o que eles afetam (resumo e lista) */}
      <section aria-label="Filtros da atividade" className="mb-6 rounded-xl border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] xl:items-start">
          <div className="sm:col-span-2 xl:col-span-1">
            <span aria-hidden="true" className="mb-1.5 block text-xs font-medium text-body dark:text-bodydark">
              Busca
            </span>
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              label="Buscar na ação, mensagem ou usuário"
              placeholder="Ação, mensagem ou usuário..."
              className="sm:max-w-none"
            />
          </div>
          <FilterSelect label="Tipo de evento" value={type} onValueChange={setType}>
            <option value="">Todos os tipos</option>
            {typeGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </FilterSelect>
          <FilterSelect label="Entidade" value={entityType} onValueChange={setEntityType}>
            <option value="">Todas as entidades</option>
            {entityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </FilterSelect>
          <FilterInput
            type="date"
            label="De"
            value={periodDraft.from}
            max={periodDraft.to}
            onChange={(e) => setPeriodField("from", e.target.value)}
          />
          <FilterInput
            type="date"
            label="Até"
            value={periodDraft.to}
            min={periodDraft.from}
            error={periodError}
            onChange={(e) => setPeriodField("to", e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-body dark:text-bodydark">Atalhos:</span>
          {QUICK_PERIODS.map((days) => (
            <Button key={days} size="xs" color="secondary" onClick={() => setQuickPeriod(days)}>
              {days === 365 ? "1 ano" : `${days} dias`}
            </Button>
          ))}
          {hasFilters && (
            <Button size="xs" color="ghost" onClick={clearFilters} leftIcon={<FilterX size={14} aria-hidden="true" />}>
              Limpar filtros
            </Button>
          )}
        </div>
      </section>

      {isError ? (
        <Card>
          {isUnavailable ? (
            <div role="alert" className="flex flex-col items-center px-4 py-12 text-center">
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light">
                <ServerCrash size={30} aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-black dark:text-white">Serviço de auditoria indisponível</h2>
              <p className="mt-1 max-w-md text-sm text-body dark:text-bodydark">
                O serviço de logs não respondeu. Os eventos continuam sendo enviados e aparecem aqui assim que ele
                voltar.
              </p>
              <Button className="mt-5" color="outline" onClick={retry} isLoading={isFetching}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            <ErrorState title="Não foi possível carregar a atividade" description={errorMessage} onRetry={retry} />
          )}
        </Card>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
            <Card
              className="xl:col-span-2"
              title="Eventos por tipo"
              titleId="activity-by-type"
              description={
                isSummaryLoading ? undefined : (
                  <>
                    <strong className="text-black dark:text-white">{formatNumber(summaryTotal ?? 0)}</strong> eventos{" "}
                    {periodText}. Clique em um tipo para filtrar.
                  </>
                )
              }
            >
              {isSummaryLoading ? (
                <div className="flex flex-wrap gap-2" aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-32 rounded-full" />
                  ))}
                </div>
              ) : byType.length === 0 ? (
                <p className="py-4 text-sm text-body dark:text-bodydark">Nenhum evento no período.</p>
              ) : (
                <ul className="flex flex-wrap gap-2" aria-label="Contagem por tipo de evento">
                  {byType.map((item) => {
                    const pressed = item.type === type;
                    return (
                      <li key={item.type}>
                        <button
                          type="button"
                          aria-pressed={pressed}
                          onClick={() => toggleType(item.type)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            pressed
                              ? "border-primary bg-primary/5 dark:border-primary-light dark:bg-primary/15"
                              : "border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                          )}
                        >
                          <EventIcon icon={item.meta.icon} tone={item.meta.tone} size="sm" />
                          <span className="text-black dark:text-white">{item.meta.label}</span>
                          <span className="font-semibold tabular-nums text-body dark:text-bodydark1">{item.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <ChartCard
              className="xl:col-span-3"
              title="Eventos por dia"
              description={`Todos os tipos, ${periodText}.`}
              summary={
                !isSummaryLoading && byDayPeak ? (
                  <>Pico em {formatDayLong(byDayPeak.date)}, com {byDayPeak.count} eventos.</>
                ) : undefined
              }
              isEmpty={!isSummaryLoading && byDay.every((d) => d.count === 0)}
              emptyMessage="Nenhum evento no período."
              table={{
                caption: `Eventos por dia, ${periodText}`,
                columns: [
                  { key: "date", label: "Dia" },
                  { key: "count", label: "Eventos", align: "right" },
                ],
                rows: byDay.map((d) => ({ date: formatDayLong(d.date), count: d.count })),
              }}
            >
              {isSummaryLoading ? (
                <Skeleton className="h-[180px] w-full" />
              ) : (
                <DailyBarChart
                  data={byDay}
                  theme={theme}
                  height={180}
                  seriesLabel="Eventos"
                  title="Eventos por dia"
                  desc={`Colunas com o número de eventos de auditoria por dia, ${periodText}.`}
                />
              )}
            </ChartCard>
          </div>

          <Card
            title="Linha do tempo"
            titleId="activity-timeline"
            description={
              isLoading
                ? "Carregando eventos..."
                : `${formatNumber(totalElements)} ${totalElements === 1 ? "evento" : "eventos"}${search ? ` para “${search}”` : ""}, do mais recente para o mais antigo.`
            }
            bodyClassName="p-0"
          >
            <div aria-busy={isFetching || undefined} className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}>
              {isLoading ? (
                <ul aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex gap-4 border-b border-stroke px-6 py-4 dark:border-strokedark">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : entriesCount === 0 ? (
                <EmptyState
                  icon={<History size={30} aria-hidden="true" />}
                  title="Nenhum evento encontrado"
                  description={hasFilters ? "Ajuste os filtros ou amplie o período." : "Os eventos aparecem aqui conforme o sistema é usado."}
                  action={hasFilters ? <Button color="outline" onClick={clearFilters}>Limpar filtros</Button> : undefined}
                />
              ) : (
                groups.map((group) => (
                  <section key={group.key} aria-label={group.label}>
                    <h3 className="sticky top-[64px] z-10 border-b border-stroke bg-gray-2 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-body first-letter:uppercase dark:border-strokedark dark:bg-meta-4 dark:text-bodydark1 sm:px-6">
                      {group.label}
                    </h3>
                    <ol className="relative">
                      {group.items.map((entry) => (
                        <li
                          key={entry.id}
                          className="relative flex gap-4 border-b border-stroke px-5 py-4 last:border-b-0 dark:border-strokedark sm:px-6"
                        >
                          <EventIcon icon={entry.meta.icon} tone={entry.meta.tone} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="font-medium text-black dark:text-white">{entry.meta.label}</span>
                              {entry.entityType && (
                                <Badge color="neutral">
                                  {entry.entityLabel}
                                  {entry.entityId && entry.entityType !== "IMPORT" ? ` #${entry.entityId}` : ""}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-0.5 break-words text-sm text-black dark:text-bodydark1">
                              {entry.message || entry.action || "—"}
                            </p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-body dark:text-bodydark">
                              <span>{entry.nameUser || "Sistema"}</span>
                              <span aria-hidden="true">·</span>
                              <time dateTime={entry.occurredAt} title={formatDateTime(entry.occurredAt)}>
                                {formatRelativeTime(entry.occurredAt)}
                              </time>
                              <span className="text-body/80 dark:text-bodydark2">({formatDateTime(entry.occurredAt)})</span>
                              {entry.link && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <Link
                                    to={entry.link}
                                    className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline dark:text-primary-light"
                                  >
                                    Abrir {entry.entityLabel.toLowerCase()}
                                    <span className="sr-only"> do evento “{entry.meta.label}”</span>
                                    <ArrowUpRight size={12} aria-hidden="true" />
                                  </Link>
                                </>
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))
              )}
            </div>
            {totalPages > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                size={pageSize}
                onPageChange={setPage}
                itemLabel="eventos"
              />
            )}
          </Card>
        </>
      )}
    </>
  );
};
