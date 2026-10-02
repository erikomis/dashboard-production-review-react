import { Link } from "react-router-dom";
import { ImageIcon, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
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
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
            {isLoading
              ? "Carregando produtos..."
              : search
                ? `${totalElements} ${totalElements === 1 ? "resultado" : "resultados"} para “${search}”`
                : `${totalElements} ${totalElements === 1 ? "produto" : "produtos"}`}
          </p>
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            label="Buscar produtos pelo nome"
            placeholder="Buscar pelo nome..."
          />
        </div>

        <Table.Root
          caption="Lista de produtos"
          aria-busy={isFetching || undefined}
          className={cn("w-full table-auto text-left text-sm transition-opacity", isFetching && !isLoading && "opacity-60")}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produto</Table.Th>
              <Table.Th>Subcategoria</Table.Th>
              <Table.Th className="hidden md:table-cell">Imagens</Table.Th>
              <Table.Th className="hidden lg:table-cell">Atualizado em</Table.Th>
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
                {search ? (
                  <EmptyState
                    title="Nenhum produto encontrado"
                    description={`Não há produtos com “${search}” no nome.`}
                    action={<Button color="outline" onClick={() => setSearchInput("")}>Limpar busca</Button>}
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
                const images = product.productImages?.length ?? 0;
                return (
                  <Table.Tr key={product.id} hover>
                    <Table.Td>
                      <span className="block font-medium text-black dark:text-white">{product.name}</span>
                      <span className="block font-mono text-xs text-body dark:text-bodydark">/{product.slug}</span>
                    </Table.Td>
                    <Table.Td>
                      {product.subCategorie?.name ? (
                        <Badge color="primary">{product.subCategorie.name}</Badge>
                      ) : (
                        <span className="text-body dark:text-bodydark">—</span>
                      )}
                    </Table.Td>
                    <Table.Td className="hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-body dark:text-bodydark">
                        <ImageIcon size={16} aria-hidden="true" />
                        {images}
                        <span className="sr-only">{images === 1 ? "imagem" : "imagens"}</span>
                      </span>
                    </Table.Td>
                    <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark lg:table-cell">
                      {formatDate(product.updatedAt ?? product.createdAt)}
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label={`Editar ${product.name}`} onClick={() => goToEdit(product.id)}>
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton
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
