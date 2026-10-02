import { Link } from "react-router-dom";
import { FilterX, ImageIcon, Package, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { DensityToggle } from "@/modules/dashboard/components/table/DensityToggle";
import { SearchInput } from "@/modules/dashboard/components/form/SearchInput";
import { FilterSelect } from "@/modules/dashboard/components/form/FilterSelect";
import { formatNote } from "@/modules/dashboard/utils/chart-data";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { IconButton } from "@/shared/components/icon-button";
import { formatDate } from "@/shared/utils/format";
import { StarRating } from "@/shared/components/star-rating";
import { cn } from "@/shared/utils/utils";
import { useProductListModel } from "./product-list.model";

const COLUMNS = 5;

type ProductListViewProps = ReturnType<typeof useProductListModel>;

export const ProductListView = ({
  products,
  page,
  setPage,
  pageSize,
  totalPages,
  totalElements,
  search,
  searchInput,
  setSearchInput,
  filters,
  categoryOptions,
  subCategoryOptions,
  sortOptions,
  sortLabel,
  isRankingOnlyRated,
  setCategory,
  setSubCategory,
  setOrder,
  hasFilters,
  clearFilters,
  isLoadingOptions,
  isLoading,
  isFetching,
  isError,
  refetch,
  deleteTarget,
  isDeleting,
  handleDeleteRequest,
  handleDeleteCancel,
  handleDeleteConfirm,
  goToCreate,
  goToEdit,
  density,
  setDensity,
}: ProductListViewProps) => {
  return (
    <>
      <PageHeader
        title="Produtos"
        description="Gerencie os produtos exibidos no site de avaliações."
        breadcrumbs={[{ label: "Produtos" }]}
        actions={
          <Link to="/dashboard/products/add" className={buttonVariants()}>
            <Plus size={18} aria-hidden="true" />
            Novo produto
          </Link>
        }
      />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 border-b border-stroke px-5 py-4 dark:border-strokedark sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
              {isLoading
                ? "Carregando produtos..."
                : `${totalElements} ${totalElements === 1 ? "produto" : "produtos"}${search ? ` para “${search}”` : ""} · ${sortLabel.toLowerCase()}${isRankingOnlyRated ? " (só com avaliações)" : ""}`}
            </p>
            <div className="flex items-center gap-3">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                label="Buscar produtos pelo nome"
                placeholder="Buscar pelo nome..."
              />
              <DensityToggle value={density} onChange={setDensity} />
            </div>
          </div>
          <div role="group" aria-label="Filtros de produtos" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <FilterSelect
              label="Categoria"
              value={filters.categoryId ?? ""}
              onValueChange={setCategory}
              disabled={isLoadingOptions}
            >
              <option value="">Todas as categorias</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label="Subcategoria"
              value={filters.subCategorieId ?? ""}
              onValueChange={setSubCategory}
              disabled={isLoadingOptions}
            >
              <option value="">Todas as subcategorias</option>
              {subCategoryOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Ordenar por" value={filters.order} onValueChange={setOrder}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>
            {hasFilters && (
              <Button color="ghost" onClick={clearFilters} leftIcon={<FilterX size={16} aria-hidden="true" />}>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        <Table.Root
          caption="Lista de produtos"
          stickyHeader
          density={density}
          aria-busy={isFetching || undefined}
          className={cn("w-full table-auto text-left text-sm transition-opacity", isFetching && !isLoading && "opacity-60")}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produto</Table.Th>
              <Table.Th className="hidden md:table-cell">Categoria</Table.Th>
              <Table.Th>Nota</Table.Th>
              <Table.Th className="hidden lg:table-cell">Criado em</Table.Th>
              <Table.Th className="text-right">
                <span className="sr-only sm:not-sr-only">Ações</span>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && <Table.LoadingRows columns={COLUMNS} rows={pageSize > 6 ? 6 : pageSize} />}

            {isError && (
              <Table.MessageRow columns={COLUMNS}>
                <ErrorState title="Erro ao carregar produtos" onRetry={refetch} />
              </Table.MessageRow>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <Table.MessageRow columns={COLUMNS}>
                {hasFilters ? (
                  <EmptyState
                    title="Nenhum produto encontrado"
                    description={
                      search
                        ? `Não há produtos com “${search}” no nome com os filtros escolhidos.`
                        : "Nenhum produto corresponde aos filtros escolhidos."
                    }
                    action={<Button color="outline" onClick={clearFilters}>Limpar filtros</Button>}
                  />
                ) : (
                  <EmptyState
                    icon={<Package size={30} aria-hidden="true" />}
                    title="Nenhum produto cadastrado"
                    description="Cadastre o primeiro produto para que ele possa receber avaliações."
                    action={
                      <Button onClick={goToCreate} leftIcon={<Plus size={18} aria-hidden="true" />}>
                        Criar produto
                      </Button>
                    }
                  />
                )}
              </Table.MessageRow>
            )}

            {!isLoading &&
              !isError &&
              products.map((product) => {
                return (
                  <Table.Tr key={product.id} hover>
                    <Table.Td>
                      <div className="flex min-w-[14rem] items-center gap-3">
                        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-meta-4">
                          <ImageIcon size={18} aria-hidden="true" className="text-body dark:text-bodydark" />
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              width={48}
                              height={48}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                              className="absolute inset-0 h-full w-full bg-white object-contain p-0.5"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium text-black dark:text-white">{product.name}</span>
                          <span className="block truncate font-mono text-xs text-body dark:text-bodydark">/{product.slug}</span>
                          <span className="mt-1 block md:hidden">
                            {product.subCategorieName && <Badge color="primary">{product.subCategorieName}</Badge>}
                          </span>
                        </span>
                      </div>
                    </Table.Td>
                    <Table.Td className="hidden md:table-cell">
                      {product.subCategorieName ? (
                        <span className="flex flex-col items-start gap-1">
                          <span className="text-xs text-body dark:text-bodydark">{product.categoryName ?? "—"}</span>
                          <Badge color="primary">{product.subCategorieName}</Badge>
                        </span>
                      ) : (
                        <span className="text-body dark:text-bodydark">—</span>
                      )}
                    </Table.Td>
                    <Table.Td className="whitespace-nowrap">
                      {product.averageNote != null ? (
                        <span className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5">
                            <StarRating value={product.averageNote} size={14} />
                            <span aria-hidden="true" className="font-semibold tabular-nums text-black dark:text-white">
                              {formatNote(product.averageNote)}
                            </span>
                          </span>
                          <span className="text-xs text-body dark:text-bodydark">
                            {product.totalReviews} {product.totalReviews === 1 ? "avaliação" : "avaliações"}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-body dark:text-bodydark">
                          <Star size={14} aria-hidden="true" />
                          Sem avaliações
                        </span>
                      )}
                    </Table.Td>
                    <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark lg:table-cell">
                      {formatDate(product.createdAt)}
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        <IconButton tooltipAlign="end" label={`Editar ${product.name}`} onClick={() => goToEdit(product.id)}>
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton tooltipAlign="end"
                          label={`Excluir ${product.name}`}
                          color="danger"
                          onClick={() => handleDeleteRequest({ id: product.id, name: product.name })}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table.Root>

        {!isError && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={pageSize}
            onPageChange={setPage}
            itemLabel="produtos"
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir produto"
        message={
          <>
            Deseja excluir o produto <strong className="text-black dark:text-white">“{deleteTarget?.name}”</strong>?
            Produtos com imagens cadastradas não podem ser excluídos.
          </>
        }
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </>
  );
};
