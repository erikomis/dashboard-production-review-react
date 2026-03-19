import { Star } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { Review } from "@/shared/types/review";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { useReviewListModel } from "./review-list.model";

const headers = ["Título", "Produto", "Avaliação", "Conteúdo", "Ações"];

type ReviewListViewProps = ReturnType<typeof useReviewListModel>;

export const ReviewListView = ({
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
}: ReviewListViewProps) => {
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Avaliações</h2>
        <button
          onClick={() => navigate("/dashboard/review/add")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
        >
          + Nova avaliação
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
                  Erro ao carregar avaliações. Tente novamente.
                </Table.Td>
              </Table.Tr>
            )}
            {!isLoading && !isError && (!data?.content || data.content.length === 0) && (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center py-6 text-gray-500">
                  Nenhuma avaliação encontrada.
                </Table.Td>
              </Table.Tr>
            )}
            {data?.content?.map((review: Review, key: number) => (
              <Table.Tr key={key}>
                <Table.Td>{review.title}</Table.Td>
                <Table.Td>{review.product?.name ?? review.productId}</Table.Td>
                <Table.Td>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < review.rating
                            ? "text-warning fill-warning"
                            : "text-gray-300 fill-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-500">{review.rating}/5</span>
                  </div>
                </Table.Td>
                <Table.Td>
                  <span className="block max-w-xs truncate">{review.content}</span>
                </Table.Td>
                <Table.Td>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/dashboard/review/${review.id}`)}
                      className="text-primary hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(review.id)}
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
        message="Deseja realmente excluir esta avaliação?"
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </div>
  );
};
