import { Link } from "react-router-dom";
import { EyeOff, FolderTree, MessageSquareText, Package, Star, Tags, Users } from "lucide-react";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { StatCard } from "@/modules/dashboard/components/stat-card/StatCard";
import { Card } from "@/modules/dashboard/components/card/Card";
import { SegmentedControl } from "@/modules/dashboard/components/segmented/SegmentedControl";
import { ChartCard } from "@/modules/dashboard/components/chart/ChartCard";
import { AverageLineChart, DailyBarChart } from "@/modules/dashboard/components/chart/DailyCharts";
import { RankedBars } from "@/modules/dashboard/components/chart/RankedBars";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Skeleton } from "@/shared/components/skeleton";
import { StarRating } from "@/shared/components/star-rating";
import { formatDayLong, formatNote } from "@/modules/dashboard/utils/chart-data";
import { formatDateTime, formatNumber, initials } from "@/shared/utils/format";
import { useHomeModel } from "./home.model";
import { PendingSection } from "./PendingSection";

type HomeViewProps = ReturnType<typeof useHomeModel>;

const ChartSkeleton = ({ height = 220 }: { height?: number }) => (
  <div aria-hidden="true" className="flex items-end gap-2" style={{ height }}>
    {Array.from({ length: 14 }).map((_, i) => (
      <Skeleton key={i} className="flex-1" style={{ height: `${20 + ((i * 37) % 70)}%` }} />
    ))}
  </div>
);

export const HomeView = (props: HomeViewProps) => {
  const {
    userName,
    days,
    setDays,
    periodOptions,
    theme,
    totals,
    averageNote,
    ratingBuckets,
    reviewsPerDay,
    usersPerDay,
    reviewsInPeriod,
    usersInPeriod,
    averageInPeriod,
    reviewsPeak,
    usersPeak,
    topProducts,
    topCategories,
    isLoadingStats,
    isRefreshingStats,
    isStatsError,
    refetchStats,
    recentReviews,
    isLoadingReviews,
    isReviewsError,
    refetchReviews,
  } = props;
  const fmt = (value?: number) => (value === undefined ? undefined : formatNumber(value));
  const periodText = `nos últimos ${days} dias`;
  const totalRated = ratingBuckets.reduce((acc, b) => acc + b.count, 0);

  return (
    <>
      <PageHeader
        title="Visão geral"
        description={
          userName
            ? `Olá, ${userName.split(" ")[0]}! Acompanhe o catálogo, as avaliações e a comunidade.`
            : "Acompanhe o catálogo, as avaliações e a comunidade."
        }
        actions={
          <SegmentedControl label="Período dos gráficos" options={periodOptions} value={days} onChange={setDays} />
        }
      />

      <section
        aria-label="Totais"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6 2xl:gap-5"
      >
        <StatCard
          title="Produtos"
          value={fmt(totals?.products)}
          isLoading={isLoadingStats}
          icon={<Package size={22} />}
          to="/dashboard/products"
          linkLabel="Ver produtos"
        />
        <StatCard
          title="Categorias"
          value={fmt(totals?.categories)}
          isLoading={isLoadingStats}
          icon={<Tags size={22} />}
          iconClassName="bg-meta-3/10 text-success-dark dark:bg-meta-3/20 dark:text-success-light"
          to="/dashboard/categories"
          linkLabel="Ver categorias"
        />
        <StatCard
          title="Subcategorias"
          value={fmt(totals?.subCategories)}
          isLoading={isLoadingStats}
          icon={<FolderTree size={22} />}
          iconClassName="bg-meta-5/10 text-meta-5 dark:bg-meta-5/20"
          to="/dashboard/sub-categories"
          linkLabel="Ver subcategorias"
        />
        <StatCard
          title="Avaliações visíveis"
          value={fmt(totals?.reviews)}
          isLoading={isLoadingStats}
          icon={<MessageSquareText size={22} />}
          iconClassName="bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning"
          to="/dashboard/review"
          linkLabel="Ver avaliações"
        />
        <StatCard
          title="Avaliações ocultas"
          value={fmt(totals?.hiddenReviews)}
          isLoading={isLoadingStats}
          icon={<EyeOff size={22} />}
          iconClassName="bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light"
          to="/dashboard/review?status=HIDDEN"
          linkLabel="Moderar"
        />
        <StatCard
          title="Usuários"
          value={fmt(totals?.users)}
          isLoading={isLoadingStats}
          icon={<Users size={22} />}
          iconClassName="bg-meta-10/10 text-[#0B7F98] dark:bg-meta-10/20 dark:text-meta-10"
          to="/dashboard/users"
          linkLabel="Ver usuários"
        />
      </section>

      <PendingSection {...props} />

      {isStatsError ? (
        <Card className="mt-6">
          <ErrorState title="Não foi possível carregar as estatísticas" onRetry={refetchStats} />
        </Card>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <ChartCard
              className="xl:col-span-2"
              title="Avaliações por dia"
              description={`Avaliações visíveis publicadas ${periodText}, com a nota média de cada dia logo abaixo.`}
              isRefreshing={isRefreshingStats}
              summary={
                isLoadingStats ? (
                  <Skeleton className="h-4 w-64" />
                ) : (
                  <span aria-live="polite">
                    <strong className="font-semibold text-black dark:text-white">{reviewsInPeriod}</strong>{" "}
                    {reviewsInPeriod === 1 ? "avaliação" : "avaliações"} {periodText}
                    {reviewsPeak && (
                      <>
                        {" "}
                        · pico em {formatDayLong(reviewsPeak.date)} ({reviewsPeak.count})
                      </>
                    )}
                    {averageInPeriod !== null && <> · média do período {formatNote(averageInPeriod)}</>}
                  </span>
                )
              }
              table={{
                caption: `Avaliações e nota média por dia, ${periodText}`,
                columns: [
                  { key: "date", label: "Dia" },
                  { key: "count", label: "Avaliações", align: "right" },
                  { key: "avg", label: "Nota média", align: "right" },
                ],
                rows: reviewsPerDay.map((d) => ({
                  date: formatDayLong(d.date),
                  count: d.count,
                  avg: formatNote(d.averageNote),
                })),
              }}
            >
              {isLoadingStats ? (
                <ChartSkeleton />
              ) : (
                <>
                  <DailyBarChart
                    data={reviewsPerDay}
                    theme={theme}
                    seriesLabel="Avaliações"
                    syncId="reviews-per-day"
                    title="Avaliações por dia"
                    desc={`Colunas com o número de avaliações por dia ${periodText}.`}
                  />
                  <h3 className="mb-1 mt-4 flex items-center gap-2 text-sm font-medium text-black dark:text-white">
                    <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-star" />
                    Nota média por dia
                    <span className="font-normal text-body dark:text-bodydark">(escala de 1 a 5)</span>
                  </h3>
                  <AverageLineChart
                    data={reviewsPerDay}
                    theme={theme}
                    syncId="reviews-per-day"
                    title="Nota média por dia"
                    desc="Linha com a nota média dos dias que tiveram avaliações, de 1 a 5."
                  />
                </>
              )}
            </ChartCard>

            <Card
              title="Distribuição de notas"
              titleId="rating-title"
              description="Todas as avaliações visíveis do catálogo."
            >
              {isLoadingStats ? (
                <div className="space-y-3" aria-hidden="true">
                  <Skeleton className="h-10 w-24" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full" />
                  ))}
                </div>
              ) : averageNote === null ? (
                <p className="py-6 text-center text-sm text-body dark:text-bodydark">
                  Ainda não há avaliações para calcular a média.
                </p>
              ) : (
                <>
                  <div className="flex items-end gap-3">
                    <span className="text-title-xl font-bold leading-none text-black dark:text-white">
                      {formatNote(averageNote)}
                    </span>
                    <StarRating value={averageNote} size={20} className="mb-1" />
                  </div>
                  <p className="mt-1 text-xs text-body dark:text-bodydark">
                    Média de {totalRated} {totalRated === 1 ? "avaliação" : "avaliações"}
                  </p>
                  <ul className="mt-6 space-y-2.5" aria-label="Distribuição das notas">
                    {ratingBuckets.map(({ note, count, percent }) => (
                      <li key={note} className="flex items-center gap-3 text-sm">
                        <span className="flex w-8 shrink-0 items-center gap-1 text-black dark:text-white">
                          {note}
                          <Star size={12} aria-hidden="true" className="fill-star text-star" />
                        </span>
                        <span
                          className="h-2 flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-meta-4"
                          aria-hidden="true"
                        >
                          <span className="block h-full rounded-full bg-star" style={{ width: `${percent}%` }} />
                        </span>
                        <span className="w-16 shrink-0 text-right tabular-nums text-body dark:text-bodydark">
                          {count} <span className="sr-only">avaliações com nota {note}, </span>({percent}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            <Card
              title="Produtos mais avaliados"
              titleId="top-products-title"
              description="Top 5 por número de avaliações visíveis."
            >
              {isLoadingStats ? (
                <RankSkeleton />
              ) : topProducts.length === 0 ? (
                <p className="py-6 text-center text-sm text-body dark:text-bodydark">Nenhum produto avaliado ainda.</p>
              ) : (
                <RankedBars items={topProducts} unit="aval." label="Produtos mais avaliados" />
              )}
            </Card>
            <Card
              title="Categorias mais avaliadas"
              titleId="top-categories-title"
              description="Top 5 por número de avaliações visíveis."
            >
              {isLoadingStats ? (
                <RankSkeleton />
              ) : topCategories.length === 0 ? (
                <p className="py-6 text-center text-sm text-body dark:text-bodydark">
                  Nenhuma categoria avaliada ainda.
                </p>
              ) : (
                <RankedBars items={topCategories} unit="aval." label="Categorias mais avaliadas" />
              )}
            </Card>
            <ChartCard
              className="lg:col-span-2 2xl:col-span-1"
              title="Novos usuários por dia"
              description={`Cadastros ${periodText}.`}
              isRefreshing={isRefreshingStats}
              summary={
                isLoadingStats ? (
                  <Skeleton className="h-4 w-48" />
                ) : (
                  <>
                    <strong className="font-semibold text-black dark:text-white">{usersInPeriod}</strong>{" "}
                    {usersInPeriod === 1 ? "novo usuário" : "novos usuários"} {periodText}
                    {usersPeak && (
                      <>
                        {" "}
                        · pico em {formatDayLong(usersPeak.date)} ({usersPeak.count})
                      </>
                    )}
                  </>
                )
              }
              table={{
                caption: `Novos usuários por dia, ${periodText}`,
                columns: [
                  { key: "date", label: "Dia" },
                  { key: "count", label: "Novos usuários", align: "right" },
                ],
                rows: usersPerDay.map((d) => ({ date: formatDayLong(d.date), count: d.count })),
              }}
            >
              {isLoadingStats ? (
                <ChartSkeleton height={200} />
              ) : (
                <DailyBarChart
                  data={usersPerDay}
                  theme={theme}
                  height={200}
                  seriesLabel="Novos usuários"
                  title="Novos usuários por dia"
                  desc={`Colunas com o número de cadastros por dia ${periodText}.`}
                />
              )}
            </ChartCard>
          </div>
        </>
      )}

      <Card
        className="mt-6"
        title="Avaliações recentes"
        titleId="recent-title"
        description="As últimas avaliações publicadas no site"
        bodyClassName="p-0"
        actions={
          <Link
            to="/dashboard/review"
            className="rounded text-sm font-medium text-primary hover:underline dark:text-primary-light"
          >
            Ver todas <span className="sr-only">as avaliações</span>→
          </Link>
        }
      >
        {isLoadingReviews ? (
          <ul aria-hidden="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex gap-4 border-b border-stroke px-6 py-4 last:border-0 dark:border-strokedark">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : isReviewsError ? (
          <ErrorState title="Não foi possível carregar as avaliações" onRetry={refetchReviews} />
        ) : recentReviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText size={30} aria-hidden="true" />}
            title="Nenhuma avaliação ainda"
            description="Quando os clientes avaliarem produtos, elas aparecerão aqui."
          />
        ) : (
          <ul>
            {recentReviews.map((review) => (
              <li
                key={review.id}
                className="flex gap-4 border-b border-stroke px-5 py-4 last:border-0 dark:border-strokedark sm:px-6"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-primary-light"
                >
                  {initials(review.userName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="font-medium text-black dark:text-white">{review.title}</p>
                    <StarRating value={review.note} size={14} />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-body dark:text-bodydark">{review.description}</p>
                  <p className="mt-1 text-xs text-body dark:text-bodydark">
                    <span className="font-medium text-black dark:text-bodydark1">{review.userName ?? "Usuário"}</span>{" "}
                    em{" "}
                    <span className="font-medium text-black dark:text-bodydark1">
                      {review.productName ?? `Produto #${review.productId}`}
                    </span>{" "}
                    · <time dateTime={review.createdAt}>{formatDateTime(review.createdAt)}</time>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
};

const RankSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-2 w-full" />
      </div>
    ))}
  </div>
);
