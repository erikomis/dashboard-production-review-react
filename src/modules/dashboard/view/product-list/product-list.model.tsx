import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { useMutationDeleteProduct } from "@/modules/dashboard/hooks/useMutationProduct";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import { useSubCategoryOptions } from "@/modules/dashboard/hooks/useSubCategoryOptions";
import {
  DEFAULT_PRODUCT_SORT,
  getProductSort,
  PRODUCT_SORT_OPTIONS,
} from "@/modules/dashboard/utils/product-sort";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { productListFiltersSchema } from "./product-list.schema";
import { ProductListFilters } from "./product-list.type";

const PAGE_SIZE = 10;

export const useProductListModel = () => {
  const navigate = useNavigate();
  // página, busca e filtros ficam na URL (a busca do header também usa ?search=)
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1) || 0;
  const search = searchParams.get("search") ?? "";
  const filters: ProductListFilters = productListFiltersSchema.parse({
    categoryId: searchParams.get("category") ?? undefined,
    subCategorieId: searchParams.get("sub") ?? undefined,
    order: searchParams.get("order") ?? undefined,
  });
  const sort = getProductSort(filters.order);

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // URL mudou por fora (ex.: busca no header): reflete no campo
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  /** Atualiza parâmetros da URL e volta para a primeira página. */
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

  const options = useSubCategoryOptions();
  // Subcategorias da categoria escolhida (ou todas)
  const subCategoryOptions = useMemo(
    () =>
      options.subCategories
        .filter((s) => !filters.categoryId || s.categorieId === filters.categoryId)
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [options.subCategories, filters.categoryId]
  );
  const categoryOptions = useMemo(
    () => [...options.categories].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [options.categories]
  );

  const setCategory = (value: string) => {
    const categoryId = Number(value) || undefined;
    const sub = options.subCategories.find((s) => s.id === filters.subCategorieId);
    // a subcategoria escolhida não pertence à nova categoria: limpa
    const keepSub = !!sub && (!categoryId || sub.categorieId === categoryId);
    updateParams({
      category: categoryId ? String(categoryId) : undefined,
      sub: keepSub ? String(sub!.id) : undefined,
    });
  };

  const setSubCategory = (value: string) => {
    const subId = Number(value) || undefined;
    const sub = options.subCategories.find((s) => s.id === subId);
    updateParams({
      sub: subId ? String(subId) : undefined,
      // escolher a subcategoria fixa a categoria correspondente
      category: sub ? String(sub.categorieId) : filters.categoryId ? String(filters.categoryId) : undefined,
    });
  };

  const setOrder = (value: string) =>
    updateParams({ order: value === DEFAULT_PRODUCT_SORT.value ? undefined : value });

  const hasFilters = !!(filters.categoryId || filters.subCategorieId || search || sort !== DEFAULT_PRODUCT_SORT);
  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const { data, isLoading, isError, isFetching, refetch } = useQueryProducts({
    page,
    size: PAGE_SIZE,
    search,
    categoryId: filters.categoryId,
    subCategorieId: filters.subCategorieId,
    property: sort.property,
    sort: sort.sort,
    onlyRated: sort.onlyRated,
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
    filters,
    categoryOptions,
    subCategoryOptions,
    sortOptions: PRODUCT_SORT_OPTIONS,
    sortLabel: sort.label,
    isRankingOnlyRated: !!sort.onlyRated,
    setCategory,
    setSubCategory,
    setOrder,
    hasFilters,
    clearFilters,
    isLoadingOptions: options.isLoading,
    isLoading,
    isFetching,
    isError,
    refetch: () => void refetch(),
    ...deleteDialog,
    goToCreate: () => navigate("/dashboard/products/add"),
    goToEdit: (id: number) => navigate(`/dashboard/products/${id}`),
  };
};
