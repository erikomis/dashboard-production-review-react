import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, EyeOff, Flag } from "lucide-react";
import { Card } from "@/modules/dashboard/components/card/Card";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Skeleton } from "@/shared/components/skeleton";
import { StarRating } from "@/shared/components/star-rating";
import { reportsLabel } from "@/modules/dashboard/utils/review-reports";
import { formatRelativeTime } from "@/modules/dashboard/utils/relative-time";
import { formatDateTime } from "@/shared/utils/format";
import { useHomeModel } from "./home.model";

type Props = Pick<
  ReturnType<typeof useHomeModel>,
  | "reportedReviews"
  | "reportedTotal"
  | "hiddenReviews"
  | "hiddenTotal"
  | "isLoadingPending"
  | "isPendingError"
  | "refetchPending"
>;

const ListSkeleton = () => (
  <ul aria-hidden="true" className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <li key={i} className="space-y-1.5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </li>
    ))}
  </ul>
);

const SeeAll = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline dark:text-primary-light"
  >
    {label}
    <ArrowRight size={14} aria-hidden="true" />
  </Link>
);

/** "Pendências" da visão geral: o que pede a atenção do administrador agora. */
export const PendingSection = ({
  reportedReviews,
  reportedTotal,
  hiddenReviews,
  hiddenTotal,
  isLoadingPending,
  isPendingError,
  refetchPending,
}: Props) => (
  <section aria-labelledby="pending-title" className="mt-6">
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <h2 id="pending-title" className="text-title-xsm font-semibold text-black dark:text-white">
        Pendências
      </h2>
      {!isLoadingPending && !isPendingError && (
        <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
          {reportedTotal === 0
            ? "Nenhuma denúncia esperando revisão."
            : `${reportedTotal} ${reportedTotal === 1 ? "avaliação denunciada espera" : "avaliações denunciadas esperam"} revisão.`}
        </p>
      )}
    </div>
    {isPendingError ? (
      <Card>
        <ErrorState title="Não foi possível carregar as pendências" onRetry={refetchPending} />
      </Card>
    ) : (
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Card
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-light">
                <Flag size={14} aria-hidden="true" />
              </span>
              Denúncias abertas
              {reportedTotal > 0 && (
                <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-semibold tabular-nums text-white">{reportedTotal}</span>
              )}
            </span>
          }
          titleId="pending-reports-title"
          actions={reportedTotal > 0 ? <SeeAll to="/dashboard/review?status=REPORTED" label="Revisar todas" /> : undefined}
          bodyClassName={reportedReviews.length > 0 ? "p-0" : undefined}
        >
          {isLoadingPending ? (
            <ListSkeleton />
          ) : reportedReviews.length === 0 ? (
            <EmptyState
              compact
              tone="success"
              icon={<CheckCircle2 size={22} aria-hidden="true" />}
              title="Tudo em ordem"
              description="Nenhuma avaliação denunciada pela comunidade."
            />
          ) : (
            <ul>
              {reportedReviews.map((review) => (
                <li key={review.id} className="border-b border-stroke last:border-0 dark:border-strokedark">
                  <Link
                    to="/dashboard/review?status=REPORTED"
                    className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-gray-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:hover:bg-meta-4/60 sm:px-6"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-black dark:text-white">{review.title}</span>
                      <span className="block truncate text-xs text-body dark:text-bodydark">
                        {review.productName ?? `Produto #${review.productId}`} · {review.userName ?? "Usuário"}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger dark:bg-danger/20 dark:text-danger-light">
                      <Flag size={12} aria-hidden="true" />
                      {reportsLabel(review.reportsCount ?? 0)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning">
                <EyeOff size={14} aria-hidden="true" />
              </span>
              Ocultadas recentemente
            </span>
          }
          titleId="pending-hidden-title"
          actions={hiddenTotal > 0 ? <SeeAll to="/dashboard/review?status=HIDDEN" label={`Ver ${hiddenTotal}`} /> : undefined}
          bodyClassName={hiddenReviews.length > 0 ? "p-0" : undefined}
        >
          {isLoadingPending ? (
            <ListSkeleton />
          ) : hiddenReviews.length === 0 ? (
            <EmptyState
              compact
              tone="neutral"
              icon={<EyeOff size={22} aria-hidden="true" />}
              title="Nenhuma avaliação oculta"
              description="As avaliações que você ocultar aparecem aqui, com o motivo."
            />
          ) : (
            <ul>
              {hiddenReviews.map((review) => (
                <li key={review.id} className="border-b border-stroke px-5 py-3.5 last:border-0 dark:border-strokedark sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium text-black dark:text-white">{review.title}</span>
                    <StarRating value={review.note} size={12} />
                  </div>
                  {review.moderationReason && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-body dark:text-bodydark">Motivo: {review.moderationReason}</p>
                  )}
                  <p className="mt-0.5 text-xs text-body dark:text-bodydark">
                    {review.moderatedByName ?? "Administrador"} ·{" "}
                    <time dateTime={review.moderatedAt ?? undefined} title={formatDateTime(review.moderatedAt)}>
                      {formatRelativeTime(review.moderatedAt)}
                    </time>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    )}
  </section>
);
