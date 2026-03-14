import { useNavigate } from "react-router-dom";
import { Table } from "../components/table";
import { useQueryCategory } from "../hooks/useQueryCategory";
import { CategoryService } from "../services/category.service";
import { queryClient } from "../../../shared/libs/react-query";
import { toast } from "react-toastify";

export const CategoryView = () => {
  const { data, isLoading, isError } = useQueryCategory();
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta categoria?")) return;
    try {
      await CategoryService.delete(id);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria excluída com sucesso!");
    } catch {
      toast.error("Erro ao excluir categoria.");
    }
  };

  const headers = ["ID", "Nome", "Descrição", "Ações"];

  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Categorias
        </h2>
        <button
          onClick={() => navigate("/dashboard/categories/add")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          + Nova categoria
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
                <Table.Td colSpan={4} className="text-center py-6 text-gray-500">
                  Carregando...
                </Table.Td>
              </Table.Tr>
            )}

            {isError && (
              <Table.Tr>
                <Table.Td colSpan={4} className="text-center py-6 text-danger">
                  Erro ao carregar categorias. Tente novamente.
                </Table.Td>
              </Table.Tr>
            )}

            {!isLoading && !isError && data?.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} className="text-center py-6 text-gray-500">
                  Nenhuma categoria encontrada.
                </Table.Td>
              </Table.Tr>
            )}

            {Array.isArray(data) &&
              data.map(
                (
                  category: { id: string; name: string; description?: string },
                  key: number
                ) => (
                  <Table.Tr key={key}>
                    <Table.Td>{category.id}</Table.Td>
                    <Table.Td>{category.name}</Table.Td>
                    <Table.Td>{category.description ?? "—"}</Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/categories/${category.id}`)
                          }
                          className="text-primary hover:underline text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-danger hover:underline text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                )
              )}
          </Table.Tbody>
        </Table.Root>
      </div>
    </div>
  );
};
