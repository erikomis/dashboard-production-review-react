import { Link } from "react-router-dom";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
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
import { useCategoryListModel } from "./category-list.model";

const COLUMNS = 5;

type CategoryListViewProps = ReturnType<typeof useCategoryListModel>;

export const CategoryListView = ({
  categories,
  total,
  filter,
  setFilter,
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
}: CategoryListViewProps) => {
  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize o catálogo em categorias. Cada categoria agrupa subcategorias."
        breadcrumbs={[{ label: "Categorias" }]}
        actions={
          <Link to="/dashboard/categories/add" className={buttonVariants()}>
            <Plus size={18} aria-hidden="true" />
            Nova categoria
          </Link>
        }
      />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
            {isLoading
              ? "Carregando categorias..."
              : filter
                ? `${categories.length} de ${total} categorias`
                : `${total} ${total === 1 ? "categoria" : "categorias"}`}
          </p>
          <SearchInput value={filter} onChange={setFilter} label="Filtrar categorias" placeholder="Filtrar por nome ou slug" />
        </div>

        <Table.Root stickyHeader caption="Lista de categorias" aria-busy={isLoading || undefined}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Categoria</Table.Th>
              <Table.Th className="hidden md:table-cell">Descrição</Table.Th>
              <Table.Th>Subcategorias</Table.Th>
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
                <ErrorState title="Erro ao carregar categorias" onRetry={refetch} />
              </Table.MessageRow>
            )}

            {!isLoading && !isError && categories.length === 0 && (
              <Table.MessageRow columns={COLUMNS}>
                {filter ? (
                  <EmptyState
                    title="Nenhuma categoria encontrada"
                    description={`Nenhum resultado para “${filter}”.`}
                    action={<Button color="outline" onClick={() => setFilter("")}>Limpar filtro</Button>}
                  />
                ) : (
                  <EmptyState
                    icon={<Tags size={30} aria-hidden="true" />}
                    title="Nenhuma categoria cadastrada"
                    description="Crie a primeira categoria para começar a organizar os produtos."
                    action={
                      <Button onClick={goToCreate} leftIcon={<Plus size={18} aria-hidden="true" />}>
                        Criar categoria
                      </Button>
                    }
                  />
                )}
              </Table.MessageRow>
            )}

            {!isLoading &&
              !isError &&
              categories.map((category) => {
                const subCount = category.subCategories?.length ?? 0;
                return (
                  <Table.Tr key={category.id} hover>
                    <Table.Td>
                      <span className="block font-medium text-black dark:text-white">{category.name}</span>
                      <span className="block font-mono text-xs text-body dark:text-bodydark">/{category.slug}</span>
                    </Table.Td>
                    <Table.Td className="hidden max-w-xs md:table-cell">
                      <span className="line-clamp-2 text-body dark:text-bodydark">{category.description || "—"}</span>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={subCount > 0 ? "primary" : "neutral"}>
                        {subCount} {subCount === 1 ? "subcategoria" : "subcategorias"}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark lg:table-cell">
                      {formatDate(category.updatedAt ?? category.createdAt)}
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label={`Editar ${category.name}`} onClick={() => goToEdit(category.id)}>
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton
                          label={`Excluir ${category.name}`}
                          color="danger"
                          onClick={() => handleDeleteRequest({ id: category.id, name: category.name })}
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
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir categoria"
        message={
          <>
            Deseja excluir a categoria <strong className="text-black dark:text-white">“{deleteTarget?.name}”</strong>?
            Categorias com subcategorias vinculadas não podem ser excluídas.
          </>
        }
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </>
  );
};
