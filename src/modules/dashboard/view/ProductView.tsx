import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../components/table";
import { Pagination } from "../components/pagination/Pagination";
import { useQueryProducts } from "../hooks/useQueryProducts";
import { Product } from "../../../shared/types/product";

const headers = ["ID", "Nome", "Descrição", "Slug", "Ações"];

export const ProductView = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQueryProducts(page);
  const navigate = useNavigate();

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Produtos
        </h2>
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
                  <button
                    onClick={() => navigate(`/dashboard/products/${product.id}`)}
                    className="text-primary hover:underline text-sm"
                  >
                    Editar
                  </button>
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
    </div>
  );
};
