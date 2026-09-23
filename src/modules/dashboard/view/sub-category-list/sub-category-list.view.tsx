import { Table } from "@/modules/dashboard/components/table";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { useSubCategoryListModel } from "./sub-category-list.model";

const headers = ["ID", "Nome", "Descrição", "Categoria", "Ações"];

type SubCategoryListViewProps = ReturnType<typeof useSubCategoryListModel>;

interface SubCategoryRow {
  id: string;
  name: string;
  description?: string;
  category?: { name: string };
}

export const SubCategoryListView = ({
  data,
  isLoading,
  isError,
  deleteId,
  handleDeleteRequest,
  handleDeleteCancel,
  handleDeleteConfirm,
  navigate,
}: SubCategoryListViewProps) => {
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Subcategorias</h2>
        <button
          onClick={() => navigate("/dashboard/sub-categories/add")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          + Nova subcategoria
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
                  Erro ao carregar subcategorias. Tente novamente.
                </Table.Td>
              </Table.Tr>
            )}
            {!isLoading && !isError && data?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center py-6 text-gray-500">
                  Nenhuma subcategoria encontrada.
                </Table.Td>
              </Table.Tr>
            )}
            {Array.isArray(data) &&
              data.map((sub: SubCategoryRow, key: number) => (
                <Table.Tr key={key}>
                  <Table.Td>{sub.id}</Table.Td>
                  <Table.Td>{sub.name}</Table.Td>
                  <Table.Td>{sub.description ?? "—"}</Table.Td>
                  <Table.Td>{sub.category?.name ?? "—"}</Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/sub-categories/${sub.id}`)}
                        className="text-primary hover:underline text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(sub.id)}
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
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        message="Deseja realmente excluir esta subcategoria?"
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </div>
  );
};
