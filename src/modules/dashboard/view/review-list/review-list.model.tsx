import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryReviews } from "@/modules/dashboard/hooks/useQueryReviews";
import { useMutationDeleteReview } from "@/modules/dashboard/hooks/useMutationReview";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";

const PAGE_SIZE = 10;

export const useReviewListModel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1) || 0;

  const { data, isLoading, isError, isFetching, refetch } = useQueryReviews(page, PAGE_SIZE);
  const { mutateAsync: deleteReview } = useMutationDeleteReview();

  const deleteDialog = useDeleteDialog({
    remove: (id) => deleteReview(id),
    successMessage: "Avaliação excluída com sucesso!",
    errorFallback: "Erro ao excluir avaliação.",
  });

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
    reviews: data?.content ?? [],
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPages: totalPages ?? 0,
    totalElements: data?.page.totalElements ?? 0,
    isLoading,
    isFetching,
    isError,
    refetch: () => void refetch(),
    ...deleteDialog,
    goToCreate: () => navigate("/dashboard/review/add"),
    goToEdit: (id: number) => navigate(`/dashboard/review/${id}`),
  };
};
