import { Link } from "react-router-dom";
import { Check, EyeOff, Flag, ThumbsUp } from "lucide-react";
import { Drawer, DrawerSection } from "@/shared/components/Drawer/drawer";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Skeleton } from "@/shared/components/skeleton";
import { StarRating } from "@/shared/components/star-rating";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { ReplyForm } from "@/modules/dashboard/components/moderation/ReplyForm";
import { ReviewPhotos } from "@/modules/dashboard/components/moderation/ReviewPhotos";
import { getReviewStatusMeta } from "@/modules/dashboard/utils/review-status";
import { getReportReasonMeta, reportsLabel } from "@/modules/dashboard/utils/review-reports";
import { formatRelativeTime } from "@/modules/dashboard/utils/relative-time";
import { formatDateTime, initials } from "@/shared/utils/format";
import { useReviewListModel } from "./review-list.model";

type Props = Pick<
  ReturnType<typeof useReviewListModel>,
  | "detailReview"
  | "closeDetail"
  | "reports"
  | "reportReasons"
  | "isLoadingReports"
  | "isReportsError"
  | "refetchReports"
  | "requestDismissReports"
  | "requestHideFromReports"
  | "requestRestore"
  | "replyEditing"
  | "replyField"
  | "replyError"
  | "replyLength"
  | "submitReply"
  | "isSavingReply"
  | "editReply"
  | "cancelReplyEdit"
  | "requestDeleteReply"
  | "openLightbox"
  | "goToEdit"
>;

/** Painel lateral da avaliação: texto completo, fotos, denúncias e resposta oficial. */
export const ReviewDetailPanel = ({
  detailReview: review,
  closeDetail,
  reports,
  reportReasons,
  isLoadingReports,
  isReportsError,
  refetchReports,
  requestDismissReports,
  requestHideFromReports,
  requestRestore,
  replyEditing,
  replyField,
  replyError,
  replyLength,
  submitReply,
  isSavingReply,
  editReply,
  cancelReplyEdit,
  requestDeleteReply,
  openLightbox,
  goToEdit,
}: Props) => {
  if (!review) return null;
  const statusMeta = getReviewStatusMeta(review.status);
  const isHidden = review.status === "HIDDEN";
  const hasReports = review.reportsCount > 0 || reports.length > 0;

  return (
    <Drawer
      isOpen
      onClose={closeDetail}
      eyebrow={
        <>
          <Badge color={statusMeta.color}>{statusMeta.label}</Badge>
          {hasReports && (
            <Badge color="danger">
              <Flag size={12} aria-hidden="true" />
              {reportsLabel(reports.length || review.reportsCount)}
            </Badge>
          )}
          {review.reply && <Badge color="primary">Respondida</Badge>}
        </>
      }
      title={review.title}
      description={
        <>
          Avaliação #{review.id} de{" "}
          <strong className="font-medium text-black dark:text-white">{review.userName ?? `Usuário #${review.userId}`}</strong>
          {review.userUsername && <span> (@{review.userUsername})</span>} sobre{" "}
          <Link
            to={`/dashboard/products/${review.productId}`}
            className="font-medium text-primary hover:underline dark:text-primary-light"
          >
            {review.productName ?? `Produto #${review.productId}`}
          </Link>
        </>
      }
      footer={
        <>
          <Button color="outline" onClick={() => goToEdit(review.id)}>
            Editar avaliação
          </Button>
          {isHidden ? (
            <Button color="secondary" onClick={() => requestRestore({ id: review.id, title: review.title })}>
              Restaurar
            </Button>
          ) : (
            !hasReports && (
              <Button color="secondary" onClick={requestHideFromReports} leftIcon={<EyeOff size={16} aria-hidden="true" />}>
                Ocultar
              </Button>
            )
          )}
        </>
      }
    >
      <DrawerSection title="Avaliação" titleId="review-detail-text">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary dark:bg-primary/20 dark:text-primary-light"
          >
            {initials(review.userName)}
          </span>
          <div className="min-w-0 flex-1">
            <StarRating value={review.note} size={16} />
            <p className="text-xs text-body dark:text-bodydark">
              <time dateTime={review.createdAt}>{formatDateTime(review.createdAt)}</time>
              <span aria-hidden="true"> · </span>
              <span className="inline-flex items-center gap-1">
                <ThumbsUp size={12} aria-hidden="true" />
                {review.helpfulCount ?? 0} {review.helpfulCount === 1 ? "achou útil" : "acharam útil"}
              </span>
            </p>
          </div>
        </div>
        <p className="mt-3 whitespace-pre-line break-words text-sm text-black dark:text-bodydark1">{review.description}</p>
        {review.photos.length > 0 && (
          <div className="mt-4">
            <ReviewPhotos
              photos={review.photos}
              reviewTitle={review.title}
              onOpen={(index) => openLightbox(review.id, index)}
              size="md"
              max={6}
            />
          </div>
        )}
        {isHidden && review.moderationReason && (
          <p className="mt-4 rounded-lg bg-warning/10 px-3 py-2 text-sm text-black dark:text-bodydark1">
            <strong className="font-semibold">Motivo da ocultação:</strong> {review.moderationReason}
            <span className="block text-xs text-body dark:text-bodydark">
              por {review.moderatedByName ?? "administrador"} · {formatDateTime(review.moderatedAt)}
            </span>
          </p>
        )}
      </DrawerSection>

      <DrawerSection title={hasReports ? `Denúncias (${reports.length || review.reportsCount})` : "Denúncias"} titleId="review-reports-title">
        {isLoadingReports ? (
          <div className="space-y-3" aria-hidden="true">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isReportsError ? (
          <ErrorState title="Não foi possível carregar as denúncias" onRetry={refetchReports} />
        ) : reports.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-body dark:text-bodydark">
            <Check size={16} aria-hidden="true" className="text-success-dark dark:text-success-light" />
            Nenhuma denúncia aberta para esta avaliação.
          </p>
        ) : (
          <>
            <ul className="mb-3 flex flex-wrap gap-1.5" aria-label="Motivos das denúncias">
              {reportReasons.map((item) => (
                <li key={item.reason}>
                  <Badge color="danger">
                    {item.label} · {item.count}
                  </Badge>
                </li>
              ))}
            </ul>
            <ol className="space-y-3">
              {reports.map((report) => {
                const meta = getReportReasonMeta(report.reason);
                return (
                  <li key={report.id} className="rounded-lg border border-stroke p-3 dark:border-strokedark">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black dark:text-white">
                        <Flag size={14} aria-hidden="true" className="text-danger dark:text-danger-light" />
                        {meta.label}
                      </span>
                      <time dateTime={report.createdAt} title={formatDateTime(report.createdAt)} className="text-xs text-body dark:text-bodydark">
                        {formatRelativeTime(report.createdAt)}
                      </time>
                    </div>
                    {report.details ? (
                      <p className="mt-1.5 whitespace-pre-line break-words text-sm text-black dark:text-bodydark1">“{report.details}”</p>
                    ) : (
                      <p className="mt-1.5 text-sm italic text-body dark:text-bodydark">{meta.description}. Sem detalhes.</p>
                    )}
                    <p className="mt-1.5 text-xs text-body dark:text-bodydark">
                      Denunciada por <span className="font-medium text-black dark:text-bodydark1">{report.reporterName ?? "usuário"}</span> em{" "}
                      {formatDateTime(report.createdAt)}
                    </p>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 flex flex-col gap-2 rounded-lg bg-gray-2 p-3 dark:bg-meta-4/50 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-body dark:text-bodydark">
                Descartar mantém a avaliação no site. Ocultar tira do site e resolve as denúncias.
              </p>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" color="outline" onClick={requestDismissReports} leftIcon={<Check size={14} aria-hidden="true" />}>
                  Descartar denúncias
                </Button>
                <Button size="sm" onClick={requestHideFromReports} leftIcon={<EyeOff size={14} aria-hidden="true" />}>
                  Ocultar
                </Button>
              </div>
            </div>
          </>
        )}
      </DrawerSection>

      <DrawerSection title="Resposta oficial" titleId="review-reply-title">
        <p className="-mt-1 mb-3 text-xs text-body dark:text-bodydark">
          Aparece no site abaixo da avaliação como “Resposta da equipe ReviewStore”, e o autor é notificado.
        </p>
        <ReplyForm
          reply={review.reply}
          isEditing={replyEditing}
          field={replyField}
          error={replyError}
          length={replyLength}
          onSubmit={submitReply}
          onEdit={editReply}
          onCancel={cancelReplyEdit}
          onRemove={requestDeleteReply}
          isSaving={isSavingReply}
        />
      </DrawerSection>
    </Drawer>
  );
};
