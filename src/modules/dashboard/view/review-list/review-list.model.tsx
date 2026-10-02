import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationDeleteReview } from "@/modules/dashboard/hooks/useMutationReview";
import {
  useMutationModerateReview,
  useQueryAdminReviews,
} from "@/modules/dashboard/hooks/useAdminReviews";
import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import {
  parseStatusFilter,
  StatusFilter,
  statusFilterToParam,
} from "@/modules/dashboard/utils/review-status";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { getErrorMessage } from "@/shared/utils/error-message";
import { hideReviewSchema, reviewFiltersSchema } from "./review-list.schema";
import { HideReviewValues, ModerationTarget } from "./review-list.type";

const PAGE_SIZE = 10;

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
  const { data, isLoading, isError, isFetching, refetch } = useQueryAdminReviews({
    ...baseFilters,
    status: statusFilterToParam(status),
    page,
    size: PAGE_SIZE,
  });
  // Contadores das abas (mesmos filtros, só o total importa)
  const visibleCount = useQueryAdminReviews({ ...baseFilters, status: "VISIBLE", page: 0, size: 1 });
  const hiddenCount = useQueryAdminReviews({ ...baseFilters, status: "HIDDEN", page: 0, size: 1 });
  const visibleTotal = visibleCount.data?.page.totalElements;
  const hiddenTotal = hiddenCount.data?.page.totalElements;

  const statusOptions: { value: StatusFilter; label: string; count?: number }[] = [
    {
      value: "ALL",
      label: "Todas",
      count: visibleTotal !== undefined && hiddenTotal !== undefined ? visibleTotal + hiddenTotal : undefined,
    },
    { value: "VISIBLE", label: "Visíveis", count: visibleTotal },
    { value: "HIDDEN", label: "Ocultas", count: hiddenTotal },
  ];

  // Produtos com avaliações (ordem alfabética) para o filtro
  const ratedProducts = useQueryProducts({ page: 0, size: 100, onlyRated: true, property: "name", sort: "ASC" });
  const reviews = useMemo(() => data?.content ?? [], [data]);
  const productOptions = useMemo(() => {
    const list = (ratedProducts.data?.content ?? []).map((p) => ({ id: p.id, name: p.name }));
    // produto filtrado que não está na lista (ex.: só tem avaliações ocultas)
    if (productId && !list.some((p) => p.id === productId)) {
      const fromRows = reviews.find((r) => r.productId === productId)?.productName;
      list.unshift({ id: productId, name: fromRows ?? `Produto #${productId}` });
    }
    return list;
  }, [ratedProducts.data, productId, reviews]);

  const hasFilters = !!(note || productId || search || status !== "ALL");
  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // ---- exclusão ----
  const { mutateAsync: deleteReview } = useMutationDeleteReview();
  const deleteDialog = useDeleteDialog({
    remove: (id) => deleteReview(id),
    successMessage: "Avaliação excluída com sucesso!",
    errorFallback: "Erro ao excluir avaliação.",
  });

  // ---- moderação ----
  const { mutateAsync: moderate, isPending: isModerating } = useMutationModerateReview();
  const [moderationTarget, setModerationTarget] = useState<ModerationTarget | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const hideForm = useForm<HideReviewValues>({
    resolver: zodResolver(hideReviewSchema),
    defaultValues: { reason: "" },
  });

  const reasonValue = useWatch({ control: hideForm.control, name: "reason" });

  const requestHide = (review: { id: number; title: string }) => {
    hideForm.reset({ reason: "" });
    setModerationTarget({ ...review, action: "hide" });
  };
  const requestRestore = (review: { id: number; title: string }) =>
    setModerationTarget({ ...review, action: "restore" });
  const cancelModeration = () => {
    if (!isModerating) setModerationTarget(null);
  };

  const runModeration = async (target: ModerationTarget, reason?: string) => {
    try {
      await moderate({
        id: target.id,
        status: target.action === "hide" ? "HIDDEN" : "VISIBLE",
        reason,
      });
      const message =
        target.action === "hide"
          ? `Avaliação “${target.title}” ocultada do site.`
          : `Avaliação “${target.title}” restaurada e visível no site.`;
      toast.success(message);
      setAnnouncement(message);
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
    ...deleteDialog,
    moderationTarget,
    isModerating,
    requestHide,
    requestRestore,
    cancelModeration,
    confirmRestore,
    submitHide,
    reasonField: hideForm.register("reason"),
    reasonError: hideForm.formState.errors.reason?.message,
    reasonLength: reasonValue?.length ?? 0,
    announcement,
    goToCreate: () => navigate("/dashboard/review/add"),
    goToEdit: (id: number) => navigate(`/dashboard/review/${id}`),
  };
};
