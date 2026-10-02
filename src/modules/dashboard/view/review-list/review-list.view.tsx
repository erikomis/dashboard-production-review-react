import { Link } from "react-router-dom";
import { MessageSquareText, Pencil, Plus, Trash2 } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { IconButton } from "@/shared/components/icon-button";
import { StarRating } from "@/shared/components/star-rating";
import { formatDateTime, initials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useReviewListModel } from "./review-list.model";

const COLUMNS = 6;

type ReviewListViewProps = ReturnType<typeof useReviewListModel>;

export const ReviewListView = ({
  reviews,
  page,
  setPage,
  pageSize,
  totalPages,
  totalElements,
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
}: ReviewListViewProps) => {
  return (
    <>
      <PageHeader
        title="Avaliações"
        description="Avaliações publicadas pelos usuários, das mais recentes para as mais antigas."
        breadcrumbs={[{ label: "Avaliações" }]}
        actions={
          <Link to="/dashboard/review/add" className={buttonVariants()}>
            <Plus size={18} aria-hidden="true" />
            Nova avaliação
          </Link>
        }
      />

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table.Root
          caption="Lista de avaliações"
          aria-busy={isFetching || undefined}
          className={cn("w-full table-auto text-left text-sm transition-opacity", isFetching && !isLoading && "opacity-60")}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Avaliação</Table.Th>
              <Table.Th>Produto</Table.Th>
              <Table.Th className="hidden md:table-cell">Usuário</Table.Th>
              <Table.Th>Nota</Table.Th>
              <Table.Th className="hidden lg:table-cell">Data</Table.Th>
              <Table.Th className="text-right">
                <span className="sr-only sm:not-sr-only">Ações</span>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading && <Table.LoadingRows columns={COLUMNS} />}

            {isError && (
              <Table.MessageRow columns={COLUMNS}>
                <ErrorState title="Erro ao carregar avaliações" onRetry={refetch} />
              </Table.MessageRow>
            )}

            {!isLoading && !isError && reviews.length === 0 && (
              <Table.MessageRow columns={COLUMNS}>
                <EmptyState
                  icon={<MessageSquareText size={30} aria-hidden="true" />}
                  title="Nenhuma avaliação ainda"
                  description="As avaliações feitas no site aparecem aqui."
                  action={
                    <Button onClick={goToCreate} leftIcon={<Plus size={18} aria-hidden="true" />}>
                      Criar avaliação
                    </Button>
                  }
                />
              </Table.MessageRow>
            )}

            {!isLoading &&
              !isError &&
              reviews.map((review) => (
                <Table.Tr key={review.id} hover>
                  <Table.Td className="min-w-[14rem] max-w-sm">
                    <span className="block font-medium text-black dark:text-white">{review.title}</span>
                    <span className="line-clamp-2 text-body dark:text-bodydark">{review.description}</span>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="primary">{review.productName ?? `Produto #${review.productId}`}</Badge>
                  </Table.Td>
                  <Table.Td className="hidden md:table-cell">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray text-xs font-semibold text-black dark:bg-meta-4 dark:text-white"
                      >
                        {initials(review.userName)}
                      </span>
                      {review.userName ?? `Usuário #${review.userId}`}
                    </span>
                  </Table.Td>
                  <Table.Td>
                    <StarRating value={review.note} size={14} />
                  </Table.Td>
                  <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark lg:table-cell">
                    <time dateTime={review.createdAt}>{formatDateTime(review.createdAt)}</time>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton label={`Editar avaliação “${review.title}”`} onClick={() => goToEdit(review.id)}>
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton
                        label={`Excluir avaliação “${review.title}”`}
                        color="danger"
                        onClick={() => handleDeleteRequest({ id: review.id, name: review.title })}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table.Root>

        {!isError && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={pageSize}
            onPageChange={setPage}
            itemLabel="avaliações"
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir avaliação"
        message={
          <>
            Deseja excluir a avaliação <strong className="text-black dark:text-white">“{deleteTarget?.name}”</strong>?
          </>
        }
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </>
  );
};
