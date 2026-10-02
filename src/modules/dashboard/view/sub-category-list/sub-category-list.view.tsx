import { Link } from "react-router-dom";
import { ChevronDown, FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { SearchInput } from "@/modules/dashboard/components/form/SearchInput";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { IconButton } from "@/shared/components/icon-button";
import { formatDate } from "@/shared/utils/format";
import { useSubCategoryListModel } from "./sub-category-list.model";

const COLUMNS = 5;

type SubCategoryListViewProps = ReturnType<typeof useSubCategoryListModel>;

export const SubCategoryListView = ({
  subCategories,
  total,
  categories,
  filter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  hasFilters,
  clearFilters,
  isLoading,
  isError,
  refetch,
  deleteTarget,
  isDeleting,
  handleDeleteRequest,
  handleDeleteCancel,
  handleDeleteConfirm,
  goToCreate,
  goToEdit,
}: SubCategoryListViewProps) => {
  return (
    <>
      <PageHeader
        title="Subcategorias"
        description="Subcategorias ficam dentro de uma categoria e classificam os produtos."
        breadcrumbs={[{ label: "Subcategorias" }]}
        actions={
          <Link to="/dashboard/sub-categories/add" className={buttonVariants()}>
            <Plus size={18} aria-hidden="true" />
            Nova subcategoria
          </Link>
        }
      />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between sm:px-6">
          <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
            {isLoading
              ? "Carregando subcategorias..."
              : hasFilters
                ? `${subCategories.length} de ${total} subcategorias`
                : `${total} ${total === 1 ? "subcategoria" : "subcategorias"}`}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <label htmlFor="category-filter" className="sr-only">
                Filtrar por categoria
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-stroke bg-transparent pl-3 pr-9 text-sm text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white sm:w-48"
              >
                <option value="">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark"
              />
            </div>
            <SearchInput value={filter} onChange={setFilter} label="Filtrar subcategorias" placeholder="Filtrar por nome ou slug" />
          </div>
        </div>

        <Table.Root stickyHeader caption="Lista de subcategorias" aria-busy={isLoading || undefined}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Subcategoria</Table.Th>
              <Table.Th>Categoria</Table.Th>
              <Table.Th className="hidden md:table-cell">Descrição</Table.Th>
              <Table.Th className="hidden lg:table-cell">Atualizada em</Table.Th>
              <Table.Th className="text-right">
                <span className="sr-only sm:not-sr-only">Ações</span>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && <Table.LoadingRows columns={COLUMNS} />}

            {isError && (
              <Table.MessageRow columns={COLUMNS}>
                <ErrorState title="Erro ao carregar subcategorias" onRetry={refetch} />
              </Table.MessageRow>
            )}

            {!isLoading && !isError && subCategories.length === 0 && (
              <Table.MessageRow columns={COLUMNS}>
                {hasFilters ? (
                  <EmptyState
                    title="Nenhuma subcategoria encontrada"
                    description="Ajuste os filtros para ver outros resultados."
                    action={<Button color="outline" onClick={clearFilters}>Limpar filtros</Button>}
                  />
                ) : (
                  <EmptyState
                    icon={<FolderTree size={30} aria-hidden="true" />}
                    title="Nenhuma subcategoria cadastrada"
                    description="Crie subcategorias para classificar os produtos dentro das categorias."
                    action={
                      <Button onClick={goToCreate} leftIcon={<Plus size={18} aria-hidden="true" />}>
                        Criar subcategoria
                      </Button>
                    }
                  />
                )}
              </Table.MessageRow>
            )}

            {!isLoading &&
              !isError &&
              subCategories.map((sub) => (
                <Table.Tr key={sub.id} hover>
                  <Table.Td>
                    <span className="block font-medium text-black dark:text-white">{sub.name}</span>
                    <span className="block font-mono text-xs text-body dark:text-bodydark">/{sub.slug}</span>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="primary">{sub.categoryName ?? `#${sub.categorieId}`}</Badge>
                  </Table.Td>
                  <Table.Td className="hidden max-w-xs md:table-cell">
                    <span className="line-clamp-2 text-body dark:text-bodydark">{sub.description || "—"}</span>
                  </Table.Td>
                  <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark lg:table-cell">
                    {formatDate(sub.updatedAt ?? sub.createdAt)}
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton label={`Editar ${sub.name}`} onClick={() => goToEdit(sub.id)}>
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton
                        label={`Excluir ${sub.name}`}
                        color="danger"
                        onClick={() => handleDeleteRequest({ id: sub.id, name: sub.name })}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table.Root>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir subcategoria"
        message={
          <>
            Deseja excluir a subcategoria{" "}
            <strong className="text-black dark:text-white">“{deleteTarget?.name}”</strong>?
          </>
        }
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </>
  );
};
