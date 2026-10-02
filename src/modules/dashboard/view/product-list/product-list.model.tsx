import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { useMutationDeleteProduct } from "@/modules/dashboard/hooks/useMutationProduct";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";

const PAGE_SIZE = 10;

export const useProductListModel = () => {
  const navigate = useNavigate();
  // página e busca ficam na URL (a busca do header também usa ?search=)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1) || 0;
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // URL mudou por fora (ex.: busca no header): reflete no campo
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

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

  const { data, isLoading, isError, isFetching, refetch } = useQueryProducts({
    page,
    size: PAGE_SIZE,
    search,
  });
  const { mutateAsync: deleteProduct } = useMutationDeleteProduct();

  const deleteDialog = useDeleteDialog({
    remove: (id) => deleteProduct(id),
    successMessage: "Produto excluído com sucesso!",
    errorFallback: "Erro ao excluir produto.",
  });

  const setPage = (nextPage: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage > 0) next.set("page", String(nextPage + 1));
      else next.delete("page");
      return next;
    });

  const pageInfo = data?.page;

  // Ex.: excluiu o último item da última página → volta para a anterior
  const totalPagesFromApi = pageInfo?.totalPages;
  useEffect(() => {
    if (totalPagesFromApi !== undefined && totalPagesFromApi > 0 && page >= totalPagesFromApi) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (totalPagesFromApi > 1) next.set("page", String(totalPagesFromApi));
          else next.delete("page");
          return next;
        },
        { replace: true }
      );
    }
  }, [page, totalPagesFromApi, setSearchParams]);

  return {
    products: data?.content ?? [],
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPages: pageInfo?.totalPages ?? 0,
    totalElements: pageInfo?.totalElements ?? 0,
    search,
    searchInput,
    setSearchInput,
    isLoading,
    isFetching,
    isError,
    refetch: () => void refetch(),
    ...deleteDialog,
    goToCreate: () => navigate("/dashboard/products/add"),
    goToEdit: (id: number) => navigate(`/dashboard/products/${id}`),
  };
};
