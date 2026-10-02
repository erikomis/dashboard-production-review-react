import { Link } from "react-router-dom";
import { FolderTree, MessageSquareText, Package, Plus, Star, Tags } from "lucide-react";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { StatCard } from "@/modules/dashboard/components/stat-card/StatCard";
import { Card } from "@/modules/dashboard/components/card/Card";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Skeleton } from "@/shared/components/skeleton";
import { StarRating } from "@/shared/components/star-rating";
import { buttonVariants } from "@/shared/components/button-variants";
import { formatDateTime, formatNumber, initials } from "@/shared/utils/format";
import { useHomeModel } from "./home.model";

type HomeViewProps = ReturnType<typeof useHomeModel>;

export const HomeView = ({
  userName,
  totalProducts,
  totalCategories,
  totalSubCategories,
  totalReviews,
  isLoadingProducts,
  isLoadingCategories,
  isLoadingSubCategories,
  isLoadingReviews,
  isReviewsError,
  refetchReviews,
  avgRating,
  sampleSize,
  isSampleTruncated,
  distribution,
  recentReviews,
}: HomeViewProps) => {
  const fmt = (value?: number) => (value === undefined ? undefined : formatNumber(value));

  return (
    <>
      <PageHeader
        title="Visão geral"
        description={
          userName
            ? `Olá, ${userName.split(" ")[0]}! Acompanhe o catálogo e as avaliações mais recentes.`
            : "Acompanhe o catálogo e as avaliações mais recentes."
        }
        actions={
          <Link to="/dashboard/products/add" className={buttonVariants()}>
            <Plus size={18} aria-hidden="true" />
            Novo produto
          </Link>
        }
      />

      <section aria-label="Totais" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-6">
        <StatCard
          title="Produtos"
          value={fmt(totalProducts)}
          isLoading={isLoadingProducts}
          icon={<Package size={22} />}
          to="/dashboard/products"
          linkLabel="Ver produtos"
        />
        <StatCard
          title="Categorias"
          value={fmt(totalCategories)}
          isLoading={isLoadingCategories}
          icon={<Tags size={22} />}
          iconClassName="bg-meta-3/10 text-success-dark dark:bg-meta-3/20 dark:text-success-light"
          to="/dashboard/categories"
          linkLabel="Ver categorias"
        />
        <StatCard
          title="Subcategorias"
          value={fmt(totalSubCategories)}
          isLoading={isLoadingSubCategories}
          icon={<FolderTree size={22} />}
          iconClassName="bg-meta-5/10 text-meta-5 dark:bg-meta-5/20"
          to="/dashboard/sub-categories"
          linkLabel="Ver subcategorias"
        />
        <StatCard
          title="Avaliações"
          value={fmt(totalReviews)}
          isLoading={isLoadingReviews}
          icon={<MessageSquareText size={22} />}
          iconClassName="bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning"
          to="/dashboard/review"
          linkLabel="Ver avaliações"
        />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Nota média"
          titleId="avg-title"
          description={
            sampleSize > 0
              ? isSampleTruncated
                ? `Com base nas ${sampleSize} avaliações mais recentes`
                : `Com base em ${sampleSize} ${sampleSize === 1 ? "avaliação" : "avaliações"}`
              : undefined
          }
        >
          {isLoadingReviews ? (
            <div className="space-y-3" aria-hidden="true">
              <Skeleton className="h-10 w-24" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>
          ) : avgRating === null ? (
            <p className="py-6 text-center text-sm text-body dark:text-bodydark">
              Ainda não há avaliações para calcular a média.
            </p>
          ) : (
            <>
              <div className="flex items-end gap-3">
                <span className="text-title-xl font-bold leading-none text-black dark:text-white">
                  {avgRating.toFixed(1).replace(".", ",")}
                </span>
                <StarRating value={avgRating} size={20} className="mb-1" />
              </div>
              <ul className="mt-6 space-y-2.5" aria-label="Distribuição das notas">
                {distribution.map(({ note, count, percent }) => (
                  <li key={note} className="flex items-center gap-3 text-sm">
                    <span className="flex w-8 shrink-0 items-center gap-1 text-black dark:text-white">
                      {note}
                      <Star size={12} aria-hidden="true" className="fill-warning text-warning" />
                    </span>
                    <span
                      className="h-2 flex-1 overflow-hidden rounded-full bg-stroke dark:bg-meta-4"
                      aria-hidden="true"
                    >
                      <span className="block h-full rounded-full bg-warning" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="w-16 shrink-0 text-right text-body dark:text-bodydark">
                      {count} <span className="sr-only">avaliações com nota {note}, </span>({percent}%)
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card
          className="xl:col-span-2"
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
              {Array.from({ length: 4 }).map((_, i) => (
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
                    <p className="mt-0.5 line-clamp-2 text-sm text-body dark:text-bodydark">
                      {review.description}
                    </p>
                    <p className="mt-1 text-xs text-body dark:text-bodydark">
                      <span className="font-medium text-black dark:text-bodydark1">
                        {review.userName ?? "Usuário"}
                      </span>{" "}
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
      </div>
    </>
  );
};
