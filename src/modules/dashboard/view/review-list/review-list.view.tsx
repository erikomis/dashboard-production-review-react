import { Link } from "react-router-dom";
import { Eye, EyeOff, FilterX, MessageSquareText, Pencil, Plus, ThumbsUp, Trash2 } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { SearchInput } from "@/modules/dashboard/components/form/SearchInput";
import { FilterSelect } from "@/modules/dashboard/components/form/FilterSelect";
import { SegmentedControl } from "@/modules/dashboard/components/segmented/SegmentedControl";
import { HideReviewModal } from "@/modules/dashboard/components/moderation/HideReviewModal";
import { getReviewStatusMeta } from "@/modules/dashboard/utils/review-status";
import { formatRelativeTime } from "@/modules/dashboard/utils/relative-time";
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
  status,
  statusOptions,
  setStatus,
  note,
  setNote,
  productId,
  productOptions,
  setProduct,
  searchInput,
  setSearchInput,
  search,
  hasFilters,
  clearFilters,
  isLoading,
  isFetching,
  isError,
  refetch,
  deleteTarget,
  isDeleting,
  handleDeleteRequest,
  handleDeleteCancel,
  handleDeleteConfirm,
  moderationTarget,
  isModerating,
  requestHide,
  requestRestore,
  cancelModeration,
  confirmRestore,
  submitHide,
  reasonField,
  reasonError,
  reasonLength,
  announcement,
  goToCreate,
  goToEdit,
}: ReviewListViewProps) => {
  return (
    <>
      <PageHeader
        title="Avaliações"
        description="Todas as avaliações do site, inclusive as ocultas. Oculte o que fere as regras e restaure quando necessário."
        breadcrumbs={[{ label: "Avaliações" }]}
        actions={
          <Link to="/dashboard/review/add" className={buttonVariants()}>
            <Plus size={18} aria-hidden="true" />
            Nova avaliação
          </Link>
        }
      />

      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 border-b border-stroke px-5 py-4 dark:border-strokedark sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SegmentedControl
              label="Status das avaliações"
              value={status}
              onChange={setStatus}
              options={statusOptions.map((o) => ({
                value: o.value,
                label: (
                  <>
                    {o.label}
                    {o.count !== undefined && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "rounded-full px-1.5 text-xs tabular-nums",
                          o.value === "HIDDEN" && o.count > 0
                            ? "bg-warning/20 text-warning-dark dark:text-warning"
                            : "bg-stroke text-black dark:bg-strokedark dark:text-bodydark1"
                        )}
                      >
                        {o.count}
                      </span>
                    )}
                  </>
                ),
                srHint: o.count !== undefined ? `${o.count} avaliações` : undefined,
              }))}
            />
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              label="Buscar no título ou no comentário"
              placeholder="Buscar no título ou comentário..."
            />
          </div>
          <div role="group" aria-label="Filtros de avaliações" className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-end">
            <FilterSelect label="Produto" value={productId ?? ""} onValueChange={setProduct}>
              <option value="">Todos os produtos avaliados</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Nota" value={note ?? ""} onValueChange={setNote}>
              <option value="">Todas as notas</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "estrela" : "estrelas"}
                </option>
              ))}
            </FilterSelect>
            {hasFilters && (
              <Button color="ghost" onClick={clearFilters} leftIcon={<FilterX size={16} aria-hidden="true" />}>
                Limpar filtros
              </Button>
            )}
          </div>
          <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
            {isLoading
              ? "Carregando avaliações..."
              : `${totalElements} ${totalElements === 1 ? "avaliação encontrada" : "avaliações encontradas"}${search ? ` para “${search}”` : ""}`}
          </p>
        </div>

        <Table.Root
          caption="Lista de avaliações com status de moderação"
          aria-busy={isFetching || undefined}
          className={cn("w-full table-auto text-left text-sm transition-opacity", isFetching && !isLoading && "opacity-60")}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Avaliação</Table.Th>
              <Table.Th className="hidden md:table-cell">Produto e autor</Table.Th>
              <Table.Th>Nota</Table.Th>
              <Table.Th>Status</Table.Th>
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
                {hasFilters ? (
                  <EmptyState
                    title={status === "HIDDEN" ? "Nenhuma avaliação oculta" : "Nenhuma avaliação encontrada"}
                    description={
                      status === "HIDDEN"
                        ? "Tudo em ordem: nenhuma avaliação foi ocultada com esses filtros."
                        : "Nenhuma avaliação corresponde aos filtros escolhidos."
                    }
                    action={<Button color="outline" onClick={clearFilters}>Limpar filtros</Button>}
                  />
                ) : (
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
                )}
              </Table.MessageRow>
            )}

            {!isLoading &&
              !isError &&
              reviews.map((review) => {
                const statusMeta = getReviewStatusMeta(review.status);
                const isHidden = review.status === "HIDDEN";
                return (
                  <Table.Tr key={review.id} hover className={cn(isHidden && "bg-warning/[0.04]")}>
                    <Table.Td className="min-w-[14rem] max-w-sm">
                      <span className={cn("block font-medium text-black dark:text-white", isHidden && "text-body dark:text-bodydark1")}>
                        {review.title}
                      </span>
                      <span className="line-clamp-2 text-body dark:text-bodydark">{review.description}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-body dark:text-bodydark">
                        <span className="inline-flex items-center gap-1" title="Marcações de “útil”">
                          <ThumbsUp size={12} aria-hidden="true" />
                          {review.helpfulCount ?? 0}
                          <span className="sr-only">{review.helpfulCount === 1 ? "pessoa achou útil" : "pessoas acharam útil"}</span>
                        </span>
                        <span className="md:hidden">{review.productName ?? `Produto #${review.productId}`}</span>
                      </span>
                    </Table.Td>
                    <Table.Td className="hidden md:table-cell">
                      <Link
                        to={`/dashboard/products/${review.productId}`}
                        className="block max-w-[14rem] truncate font-medium text-primary hover:underline dark:text-primary-light"
                      >
                        {review.productName ?? `Produto #${review.productId}`}
                      </Link>
                      <span className="mt-1 flex items-center gap-2 whitespace-nowrap text-body dark:text-bodydark">
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-gray text-[10px] font-semibold text-black dark:bg-meta-4 dark:text-white"
                        >
                          {initials(review.userName)}
                        </span>
                        {review.userName ?? `Usuário #${review.userId}`}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <StarRating value={review.note} size={14} />
                    </Table.Td>
                    <Table.Td className="min-w-[9rem] max-w-[16rem]">
                      <Badge color={statusMeta.color}>
                        {isHidden ? <EyeOff size={12} aria-hidden="true" /> : <Eye size={12} aria-hidden="true" />}
                        {statusMeta.label}
                      </Badge>
                      {isHidden && (
                        <span className="mt-1 block text-xs text-body dark:text-bodydark">
                          {review.moderationReason && (
                            <span className="line-clamp-2" title={review.moderationReason}>
                              Motivo: {review.moderationReason}
                            </span>
                          )}
                          <span className="block">
                            por {review.moderatedByName ?? "administrador"}
                            {review.moderatedAt && (
                              <>
                                {" "}·{" "}
                                <time dateTime={review.moderatedAt} title={formatDateTime(review.moderatedAt)}>
                                  {formatRelativeTime(review.moderatedAt)}
                                </time>
                              </>
                            )}
                          </span>
                        </span>
                      )}
                      {!isHidden && review.moderatedAt && (
                        <span className="mt-1 block text-xs text-body dark:text-bodydark">
                          Restaurada por {review.moderatedByName ?? "administrador"} ·{" "}
                          <time dateTime={review.moderatedAt} title={formatDateTime(review.moderatedAt)}>
                            {formatRelativeTime(review.moderatedAt)}
                          </time>
                        </span>
                      )}
                    </Table.Td>
                    <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark lg:table-cell">
                      <time dateTime={review.createdAt}>{formatDateTime(review.createdAt)}</time>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        {isHidden ? (
                          <IconButton tooltipAlign="end"
                            label={`Restaurar avaliação “${review.title}”`}
                            onClick={() => requestRestore({ id: review.id, title: review.title })}
                          >
                            <Eye size={18} />
                          </IconButton>
                        ) : (
                          <IconButton tooltipAlign="end"
                            label={`Ocultar avaliação “${review.title}”`}
                            onClick={() => requestHide({ id: review.id, title: review.title })}
                          >
                            <EyeOff size={18} />
                          </IconButton>
                        )}
                        <IconButton tooltipAlign="end" label={`Editar avaliação “${review.title}”`} onClick={() => goToEdit(review.id)}>
                          <Pencil size={18} />
                        </IconButton>
                        <IconButton tooltipAlign="end"
                          label={`Excluir avaliação “${review.title}”`}
                          color="danger"
                          onClick={() => handleDeleteRequest({ id: review.id, name: review.title })}
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
            itemLabel="avaliações"
          />
        )}
      </div>

      <HideReviewModal
        isOpen={moderationTarget?.action === "hide"}
        reviewTitle={moderationTarget?.title}
        reasonField={reasonField}
        reasonError={reasonError}
        reasonLength={reasonLength}
        isLoading={isModerating}
        onSubmit={submitHide}
        onClose={cancelModeration}
      />

      <ConfirmModal
        isOpen={moderationTarget?.action === "restore"}
        tone="primary"
        irreversible={false}
        title="Restaurar avaliação"
        message={
          <>
            A avaliação <strong className="text-black dark:text-white">“{moderationTarget?.title}”</strong> volta a
            aparecer no site e a contar nas notas médias. O motivo da moderação será apagado.
          </>
        }
        confirmLabel="Restaurar"
        loadingLabel="Restaurando..."
        isLoading={isModerating}
        onConfirm={confirmRestore}
        onClose={cancelModeration}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir avaliação"
        message={
          <>
            Deseja excluir a avaliação <strong className="text-black dark:text-white">“{deleteTarget?.name}”</strong>?
            Para apenas tirá-la do site, prefira ocultar.
          </>
        }
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
      />
    </>
  );
};
