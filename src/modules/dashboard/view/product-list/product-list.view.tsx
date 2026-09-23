import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { Product } from "@/shared/types/product";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { useProductListModel } from "./product-list.model";

const headers = ["ID", "Nome", "Descrição", "Slug", "Ações"];

type ProductListViewProps = ReturnType<typeof useProductListModel>;

export const ProductListView = ({
  page,
  setPage,
  data,
  isLoading,
  isError,
  totalPages,
  deleteId,
  handleDeleteRequest,
  handleDeleteCancel,
  handleDeleteConfirm,
  navigate,
}: ProductListViewProps) => {
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Produtos</h2>
        <button
          onClick={() => navigate("/dashboard/products/add")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          + Novo produto
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <Table.Root>
          <Table.Thead>
            <Table.Tr className="text-left bg-gray-2 dark:bg-meta-4">
              {headers.map((header, key) => (
                <Table.Th key={key}>{header}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center py-6 text-gray-500">
                  Carregando...
                </Table.Td>
              </Table.Tr>
            )}
            {isError && (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center py-6 text-danger">
                  Erro ao carregar produtos. Tente novamente.
                </Table.Td>
              </Table.Tr>
            )}
            {!isLoading && !isError && data?.content?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center py-6 text-gray-500">
                  Nenhum produto encontrado.
                </Table.Td>
              </Table.Tr>
            )}
            {data?.content?.map((product: Product, key: number) => (
              <Table.Tr key={key}>
                <Table.Td>{product.id}</Table.Td>
                <Table.Td>{product.name}</Table.Td>
                <Table.Td>{product.description}</Table.Td>
                <Table.Td>{product.slug}</Table.Td>
                <Table.Td>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/dashboard/products/${product.id}`)}
                      className="text-primary hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(product.id)}
                      className="text-danger hover:underline text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table.Root>

        {totalPages > 1 && (
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p - 1)}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        message="Deseja realmente excluir este produto?"
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </div>
  );
};
