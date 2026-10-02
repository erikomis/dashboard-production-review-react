import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationDeleteReview } from "@/modules/dashboard/hooks/useMutationReview";
import {
  useMutationDeleteReply,
  useMutationDeleteReviewImage,
  useMutationDismissReports,
  useMutationModerateReview,
  useMutationModerateReviews,
  useMutationReplyReview,
  useQueryAdminReviews,
  useQueryReviewReports,
} from "@/modules/dashboard/hooks/useAdminReviews";
import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import { useCsvExport } from "@/modules/dashboard/hooks/useCsvExport";
import { useTableDensityPreference } from "@/modules/dashboard/hooks/useTableDensityPreference";
import { AdminReviewsService } from "@/modules/dashboard/services/admin-reviews.service";
import {
  parseStatusFilter,
  reportedFilterToParam,
  StatusFilter,
  statusFilterToParam,
} from "@/modules/dashboard/utils/review-status";
import { groupReportReasons, reportsLabel, suggestedHideReason } from "@/modules/dashboard/utils/review-reports";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useRowSelection } from "@/shared/hooks/useRowSelection";
import { getErrorMessage } from "@/shared/utils/error-message";
import { resolveMediaUrl } from "@/shared/utils/media-url";
import { hideReviewSchema, replySchema, reviewFiltersSchema } from "./review-list.schema";
import { DetailFocus, HideReviewValues, ModerationTarget, PendingConfirm, ReplyValues } from "./review-list.type";

const PAGE_SIZE = 10;

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export const useReviewListModel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1) || 0;
  const status = parseStatusFilter(searchParams.get("status"));
  const search = searchParams.get("search") ?? "";
  const { note, productId } = reviewFiltersSchema.parse({
    note: searchParams.get("note") ?? undefined,
    productId: searchParams.get("product") ?? undefined,
  });

  const updateParams = (changes: Record<string, string | undefined>) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        next.delete("page");
        return next;
      },
      { replace: true }
    );

  // ---- busca com debounce ----
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  useEffect(() => {
    if (debouncedSearch.trim() === search) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch.trim()) next.set("search", debouncedSearch.trim());
        else next.delete("search");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, search, setSearchParams]);

  const baseFilters = { note, productId, search };
  const listFilters = {
    ...baseFilters,
    status: statusFilterToParam(status),
    reported: reportedFilterToParam(status),
  };
  const { data, isLoading, isError, isFetching, refetch } = useQueryAdminReviews({
    ...listFilters,
    page,
    size: PAGE_SIZE,
  });
  // Contadores das abas (mesmos filtros, só o total importa)
  const visibleCount = useQueryAdminReviews({ ...baseFilters, status: "VISIBLE", page: 0, size: 1 });
  const hiddenCount = useQueryAdminReviews({ ...baseFilters, status: "HIDDEN", page: 0, size: 1 });
  const reportedCount = useQueryAdminReviews({ ...baseFilters, reported: true, page: 0, size: 1 });
  const visibleTotal = visibleCount.data?.page.totalElements;
  const hiddenTotal = hiddenCount.data?.page.totalElements;
  const reportedTotal = reportedCount.data?.page.totalElements;

  const statusOptions: { value: StatusFilter; label: string; count?: number; tone: "neutral" | "warning" | "danger" }[] = [
    {
      value: "ALL",
      label: "Todas",
      count: visibleTotal !== undefined && hiddenTotal !== undefined ? visibleTotal + hiddenTotal : undefined,
      tone: "neutral",
    },
    { value: "VISIBLE", label: "Visíveis", count: visibleTotal, tone: "neutral" },
    { value: "HIDDEN", label: "Ocultas", count: hiddenTotal, tone: "warning" },
    { value: "REPORTED", label: "Denunciadas", count: reportedTotal, tone: "danger" },
  ];

  // Produtos com avaliações (ordem alfabética) para o filtro
  const ratedProducts = useQueryProducts({ page: 0, size: 100, onlyRated: true, property: "name", sort: "ASC" });
  // Fotos com URL absoluta (a API devolve `/api/v1/files/...`)
  const reviews = useMemo(
    () =>
      (data?.content ?? []).map((review) => ({
        ...review,
        photos: (review.images ?? []).map((image) => ({ id: image.id, src: resolveMediaUrl(image.url) })),
        reportsCount: review.reportsCount ?? 0,
      })),
    [data]
  );
  const productOptions = (ratedProducts.data?.content ?? []).map((p) => ({ id: p.id, name: p.name }));
  // produto filtrado que não está na lista (ex.: só tem avaliações ocultas)
  if (productId && !productOptions.some((p) => p.id === productId)) {
    const fromRows = reviews.find((r) => r.productId === productId)?.productName;
    productOptions.unshift({ id: productId, name: fromRows ?? `Produto #${productId}` });
  }

  const hasFilters = !!(note || productId || search || status !== "ALL");
  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // ---- densidade ----
  const [density, setDensity] = useTableDensityPreference();

  // ---- seleção em lote ----
  const selectionScope = JSON.stringify({ ...listFilters, page });
  const selection = useRowSelection(
    reviews.map((r) => r.id),
    selectionScope
  );
  const selectedReviews = reviews.filter((r) => selection.isSelected(r.id));
  const selectedToHide = selectedReviews.filter((r) => r.status !== "HIDDEN");
  const selectedToRestore = selectedReviews.filter((r) => r.status === "HIDDEN");

  // ---- exclusão ----
  const { mutateAsync: deleteReview } = useMutationDeleteReview();
  const deleteDialog = useDeleteDialog({
    remove: (id) => deleteReview(id),
    successMessage: "Avaliação excluída com sucesso!",
    errorFallback: "Erro ao excluir avaliação.",
  });

  // ---- moderação (individual e em lote) ----
  const { mutateAsync: moderate, isPending: isModeratingOne } = useMutationModerateReview();
  const { mutateAsync: moderateMany, isPending: isModeratingMany } = useMutationModerateReviews();
  const isModerating = isModeratingOne || isModeratingMany;
  const [moderationTarget, setModerationTarget] = useState<ModerationTarget | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const announce = (message: string) => {
    toast.success(message);
    setAnnouncement(message);
  };
  const hideForm = useForm<HideReviewValues>({
    resolver: zodResolver(hideReviewSchema),
    defaultValues: { reason: "" },
  });
  const reasonValue = useWatch({ control: hideForm.control, name: "reason" });

  const requestHide = (review: { id: number; title: string; reportsCount?: number }, reason = "") => {
    hideForm.reset({ reason });
    setModerationTarget({ action: "hide", ids: [review.id], bulk: false, title: review.title, reportsCount: review.reportsCount });
  };
  const requestRestore = (review: { id: number; title: string }) =>
    setModerationTarget({ action: "restore", ids: [review.id], bulk: false, title: review.title });
  const requestBulkHide = () => {
    if (selectedToHide.length === 0) return;
    hideForm.reset({ reason: "" });
    setModerationTarget({
      action: "hide",
      ids: selectedToHide.map((r) => r.id),
      bulk: true,
      reportsCount: selectedToHide.reduce((acc, r) => acc + r.reportsCount, 0),
    });
  };
  const requestBulkRestore = () => {
    if (selectedToRestore.length === 0) return;
    setModerationTarget({ action: "restore", ids: selectedToRestore.map((r) => r.id), bulk: true });
  };
  const cancelModeration = () => {
    if (!isModerating) setModerationTarget(null);
  };

  const runModeration = async (target: ModerationTarget, reason?: string) => {
    const nextStatus = target.action === "hide" ? "HIDDEN" : "VISIBLE";
    try {
      if (target.bulk) {
        const { updated } = await moderateMany({ ids: target.ids, status: nextStatus, reason });
        const verb = target.action === "hide" ? "ocultada" : "restaurada";
        const verbs = target.action === "hide" ? "ocultadas" : "restauradas";
        const skipped = target.ids.length - updated;
        announce(
          `${updated} ${updated === 1 ? `avaliação ${verb}` : `avaliações ${verbs}`}.` +
            (skipped > 0 ? ` ${plural(skipped, "não foi encontrada", "não foram encontradas")}.` : "")
        );
        selection.clear();
      } else {
        await moderate({ id: target.ids[0], status: nextStatus, reason });
        announce(
          target.action === "hide"
            ? `Avaliação “${target.title}” ocultada do site.` +
                (target.reportsCount
                  ? ` ${reportsLabel(target.reportsCount)} ${target.reportsCount === 1 ? "resolvida" : "resolvidas"}.`
                  : "")
            : `Avaliação “${target.title}” restaurada e visível no site.`
        );
      }
      setModerationTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível moderar a avaliação."));
    }
  };

  const submitHide = hideForm.handleSubmit(async ({ reason }) => {
    if (moderationTarget) await runModeration(moderationTarget, reason);
  });
  const confirmRestore = () => {
    if (moderationTarget) void runModeration(moderationTarget);
  };

  // ---- painel lateral (detalhes, denúncias e resposta) ----
  const [detail, setDetail] = useState<{ id: number; focus: DetailFocus } | null>(null);
  const detailReview = detail ? (reviews.find((r) => r.id === detail.id) ?? null) : null;
  const reportsQuery = useQueryReviewReports(detailReview ? detailReview.id : null);
  const reports = useMemo(() => reportsQuery.data ?? [], [reportsQuery.data]);

  const replyForm = useForm<ReplyValues>({ resolver: zodResolver(replySchema), defaultValues: { text: "" } });
  const replyText = useWatch({ control: replyForm.control, name: "text" });
  const [replyEditing, setReplyEditing] = useState(false);

  const openDetail = (id: number, focus: DetailFocus = "details") => {
    const review = reviews.find((r) => r.id === id);
    replyForm.reset({ text: review?.reply?.text ?? "" });
    setReplyEditing(focus === "reply" || !review?.reply);
    setDetail({ id, focus });
  };
  const closeDetail = () => setDetail(null);

  // Leva à seção pedida (denúncias ou resposta) ao abrir o painel
  useEffect(() => {
    if (!detail || detail.focus === "details") return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(detail.focus === "reply" ? "official-reply" : "review-reports-title");
      target?.scrollIntoView?.({ block: "center" });
      if (detail.focus === "reply" && target instanceof HTMLTextAreaElement) target.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [detail]);

  const { mutateAsync: saveReply, isPending: isSavingReply } = useMutationReplyReview();
  const submitReply = replyForm.handleSubmit(async ({ text }) => {
    if (!detailReview) return;
    try {
      await saveReply({ id: detailReview.id, text });
      announce(detailReview.reply ? "Resposta oficial atualizada." : "Resposta oficial publicada no site.");
      setReplyEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível salvar a resposta."));
    }
  });
  const editReply = () => {
    replyForm.reset({ text: detailReview?.reply?.text ?? "" });
    setReplyEditing(true);
  };
  const cancelReplyEdit = () => {
    replyForm.reset({ text: detailReview?.reply?.text ?? "" });
    setReplyEditing(false);
  };

  // ---- fotos (visualizador) ----
  const [lightbox, setLightbox] = useState<{ reviewId: number; index: number } | null>(null);
  const lightboxReview = lightbox ? (reviews.find((r) => r.id === lightbox.reviewId) ?? null) : null;

  // ---- confirmações (descartar denúncias, remover resposta, remover foto) ----
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const { mutateAsync: dismissReports, isPending: isDismissing } = useMutationDismissReports();
  const { mutateAsync: deleteReply, isPending: isDeletingReply } = useMutationDeleteReply();
  const { mutateAsync: deleteImage, isPending: isDeletingImage } = useMutationDeleteReviewImage();
  const isConfirming = isDismissing || isDeletingReply || isDeletingImage;

  const runConfirm = async () => {
    if (!pendingConfirm) return;
    try {
      if (pendingConfirm.kind === "dismiss-reports") {
        await dismissReports(pendingConfirm.reviewId);
        announce(
          `${reportsLabel(pendingConfirm.count)} ${pendingConfirm.count === 1 ? "descartada" : "descartadas"}. A avaliação continua visível.`
        );
      } else if (pendingConfirm.kind === "delete-reply") {
        await deleteReply(pendingConfirm.reviewId);
        replyForm.reset({ text: "" });
        setReplyEditing(true);
        announce("Resposta oficial removida.");
      } else {
        await deleteImage({ reviewId: pendingConfirm.reviewId, imageId: pendingConfirm.imageId });
        announce("Foto removida da avaliação.");
        // fecha o visualizador se era a última foto; senão fica numa vizinha
        const remaining = (lightboxReview?.photos.length ?? 1) - 1;
        if (remaining <= 0) setLightbox(null);
        else setLightbox((current) => (current ? { ...current, index: Math.min(current.index, remaining - 1) } : null));
      }
      setPendingConfirm(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível concluir a ação."));
    }
  };

  const setPage = (nextPage: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage > 0) next.set("page", String(nextPage + 1));
      else next.delete("page");
      return next;
    });

  const totalPages = data?.page.totalPages;
  useEffect(() => {
    if (totalPages !== undefined && totalPages > 0 && page >= totalPages) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (totalPages > 1) next.set("page", String(totalPages));
          else next.delete("page");
          return next;
        },
        { replace: true }
      );
    }
  }, [page, totalPages, setSearchParams]);

  // ---- exportação (filtros atuais) ----
  const csv = useCsvExport(() => AdminReviewsService.exportCsv(listFilters), "avaliações");

  return {
    reviews,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPages: totalPages ?? 0,
    totalElements: data?.page.totalElements ?? 0,
    status,
    statusOptions,
    setStatus: (value: StatusFilter) => updateParams({ status: value === "ALL" ? undefined : value }),
    note,
    setNote: (value: string) => updateParams({ note: value || undefined }),
    productId,
    productOptions,
    setProduct: (value: string) => updateParams({ product: value || undefined }),
    searchInput,
    setSearchInput,
    search,
    hasFilters,
    clearFilters,
    isLoading,
    isFetching,
    isError,
    refetch: () => void refetch(),
    density,
    setDensity,
    // seleção em lote
    selectedCount: selection.selectedIds.length,
    isSelected: selection.isSelected,
    toggleSelected: selection.toggle,
    togglePageSelection: selection.togglePage,
    clearSelection: selection.clear,
    allSelected: selection.allSelected,
    someSelected: selection.someSelected,
    bulkHideCount: selectedToHide.length,
    bulkRestoreCount: selectedToRestore.length,
    requestBulkHide,
    requestBulkRestore,
    // exclusão
    ...deleteDialog,
    // moderação
    moderationTarget,
    isModerating,
    requestHide,
    requestRestore,
    cancelModeration,
    confirmRestore,
    submitHide,
    pickReason: (reason: string) => hideForm.setValue("reason", reason, { shouldValidate: true }),
    reasonField: hideForm.register("reason"),
    reasonError: hideForm.formState.errors.reason?.message,
    reasonLength: reasonValue?.length ?? 0,
    announcement,
    // painel lateral
    detailReview,
    openDetail,
    closeDetail,
    reports,
    reportReasons: groupReportReasons(reports),
    isLoadingReports: reportsQuery.isLoading,
    isReportsError: reportsQuery.isError,
    refetchReports: () => void reportsQuery.refetch(),
    requestDismissReports: () => {
      if (!detailReview) return;
      setPendingConfirm({
        kind: "dismiss-reports",
        reviewId: detailReview.id,
        title: detailReview.title,
        count: reports.length || detailReview.reportsCount,
      });
    },
    requestHideFromReports: () => {
      if (!detailReview) return;
      requestHide(
        { id: detailReview.id, title: detailReview.title, reportsCount: reports.length || detailReview.reportsCount },
        suggestedHideReason(reports)
      );
    },
    // resposta oficial
    replyEditing,
    replyField: replyForm.register("text"),
    replyError: replyForm.formState.errors.text?.message,
    replyLength: replyText?.length ?? 0,
    submitReply,
    isSavingReply,
    editReply,
    cancelReplyEdit,
    requestDeleteReply: () => {
      if (detailReview) setPendingConfirm({ kind: "delete-reply", reviewId: detailReview.id, title: detailReview.title });
    },
    // fotos
    lightboxReview,
    lightboxIndex: lightbox?.index ?? 0,
    openLightbox: (reviewId: number, index: number) => setLightbox({ reviewId, index }),
    setLightboxIndex: (index: number) => setLightbox((current) => (current ? { ...current, index } : null)),
    closeLightbox: () => setLightbox(null),
    requestDeleteImage: (imageId: number) => {
      if (lightboxReview)
        setPendingConfirm({ kind: "delete-image", reviewId: lightboxReview.id, imageId, title: lightboxReview.title });
    },
    // confirmações
    pendingConfirm,
    isConfirming,
    confirmPending: () => void runConfirm(),
    cancelPending: () => {
      if (!isConfirming) setPendingConfirm(null);
    },
    // exportação
    exportCsv: csv.exportCsv,
    isExporting: csv.isExporting,
    goToCreate: () => navigate("/dashboard/review/add"),
    goToEdit: (id: number) => navigate(`/dashboard/review/${id}`),
  };
};
