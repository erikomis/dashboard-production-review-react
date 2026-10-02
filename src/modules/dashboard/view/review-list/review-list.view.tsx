import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  FilterX,
  Flag,
  MessageSquareReply,
  MessageSquareText,
  MoreHorizontal,
  PanelRightOpen,
  Pencil,
  Plus,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { DensityToggle } from "@/modules/dashboard/components/table/DensityToggle";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { SearchInput } from "@/modules/dashboard/components/form/SearchInput";
import { FilterSelect } from "@/modules/dashboard/components/form/FilterSelect";
import { SegmentedControl } from "@/modules/dashboard/components/segmented/SegmentedControl";
import { HideReviewModal } from "@/modules/dashboard/components/moderation/HideReviewModal";
import { BulkActionBar } from "@/modules/dashboard/components/moderation/BulkActionBar";
import { ReviewPhotos } from "@/modules/dashboard/components/moderation/ReviewPhotos";
import { ExportCsvButton } from "@/modules/dashboard/components/export/ExportCsvButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/dashboard/components/dropdown-menu";
import { getReviewStatusMeta } from "@/modules/dashboard/utils/review-status";
import { reportsLabel } from "@/modules/dashboard/utils/review-reports";
import { formatRelativeTime } from "@/modules/dashboard/utils/relative-time";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Lightbox } from "@/shared/components/lightbox/Lightbox";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { Checkbox } from "@/shared/components/checkbox";
import { IconButton } from "@/shared/components/icon-button";
import { StarRating } from "@/shared/components/star-rating";
import { formatDateTime, initials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useReviewListModel } from "./review-list.model";
import { ReviewDetailPanel } from "./ReviewDetailPanel";

const COLUMNS = 7;

type ReviewListViewProps = ReturnType<typeof useReviewListModel>;

const COUNT_TONE = {
  neutral: "bg-stroke text-black dark:bg-strokedark dark:text-bodydark1",
  warning: "bg-warning/20 text-warning-dark dark:text-warning",
  danger: "bg-danger/15 text-danger dark:bg-danger/25 dark:text-danger-light",
};

export const ReviewListView = (props: ReviewListViewProps) => {
  const {
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
    density,
    setDensity,
    selectedCount,
    isSelected,
    toggleSelected,
    togglePageSelection,
    clearSelection,
    allSelected,
    someSelected,
    bulkHideCount,
    bulkRestoreCount,
    requestBulkHide,
    requestBulkRestore,
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
    pickReason,
    reasonField,
    reasonError,
    reasonLength,
    announcement,
    openDetail,
    lightboxReview,
    lightboxIndex,
    openLightbox,
    setLightboxIndex,
    closeLightbox,
    requestDeleteImage,
    pendingConfirm,
    isConfirming,
    confirmPending,
    cancelPending,
    exportCsv,
    isExporting,
    goToCreate,
    goToEdit,
  } = props;

  const restoreCount = moderationTarget?.ids.length ?? 0;

  return (
    <>
      <PageHeader
        title="Avaliações"
        description="Todas as avaliações do site, inclusive as ocultas. Responda, trate denúncias e modere uma a uma ou em lote."
        breadcrumbs={[{ label: "Avaliações" }]}
        actions={
          <>
            <ExportCsvButton
              onExport={exportCsv}
              isExporting={isExporting}
              description="Baixa as avaliações com os filtros atuais (CSV com ; para o Excel)"
            />
            <Link to="/dashboard/review/add" className={buttonVariants()}>
              <Plus size={18} aria-hidden="true" />
              Nova avaliação
            </Link>
          </>
        }
      />

      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>

      <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-col gap-4 border-b border-stroke px-5 py-4 dark:border-strokedark sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <SegmentedControl
              label="Status das avaliações"
              value={status}
              onChange={setStatus}
              options={statusOptions.map((o) => ({
                value: o.value,
                label: (
                  <>
                    {o.value === "REPORTED" && <Flag size={14} aria-hidden="true" />}
                    {o.label}
                    {o.count !== undefined && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "rounded-full px-1.5 text-xs tabular-nums",
                          o.tone !== "neutral" && o.count > 0 ? COUNT_TONE[o.tone] : COUNT_TONE.neutral
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
          <div
            role="group"
            aria-label="Filtros de avaliações"
            className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-end"
          >
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
              {isLoading
                ? "Carregando avaliações..."
                : `${totalElements} ${totalElements === 1 ? "avaliação encontrada" : "avaliações encontradas"}${search ? ` para “${search}”` : ""}`}
            </p>
            <DensityToggle value={density} onChange={setDensity} />
          </div>
        </div>

        <Table.Root
          caption="Lista de avaliações com status de moderação, denúncias e resposta oficial"
          aria-busy={isFetching || undefined}
          stickyHeader
          density={density}
          className={cn("w-full table-auto text-left text-sm transition-opacity", isFetching && !isLoading && "opacity-60")}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-10 !pr-0">
                <Checkbox
                  label="Selecionar todas as avaliações desta página"
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={reviews.length === 0}
                  onChange={togglePageSelection}
                />
              </Table.Th>
              <Table.Th>Avaliação</Table.Th>
              <Table.Th className="hidden md:table-cell">Produto e autor</Table.Th>
              <Table.Th>Nota</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th className="hidden 2xl:table-cell">Data</Table.Th>
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
                {status === "REPORTED" && !search && !note && !productId ? (
                  <EmptyState
                    tone="success"
                    icon={<CheckCircle2 size={30} aria-hidden="true" />}
                    title="Nenhuma denúncia aberta"
                    description="Tudo em ordem: quando alguém denunciar uma avaliação no site, ela aparece aqui para você revisar."
                    action={
                      <Button color="outline" onClick={() => setStatus("ALL")}>
                        Ver todas as avaliações
                      </Button>
                    }
                  />
                ) : hasFilters ? (
                  <EmptyState
                    icon={<FilterX size={28} aria-hidden="true" />}
                    title={status === "HIDDEN" ? "Nenhuma avaliação oculta" : "Nenhuma avaliação encontrada"}
                    description={
                      status === "HIDDEN"
                        ? "Tudo em ordem: nenhuma avaliação foi ocultada com esses filtros."
                        : "Nenhuma avaliação corresponde aos filtros escolhidos. Tente ampliar a busca."
                    }
                    action={
                      <Button color="outline" onClick={clearFilters}>
                        Limpar filtros
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    icon={<MessageSquareText size={30} aria-hidden="true" />}
                    title="Nenhuma avaliação ainda"
                    description="As avaliações feitas no site aparecem aqui para você acompanhar, responder e moderar."
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
                const selected = isSelected(review.id);
                return (
                  <Table.Tr
                    key={review.id}
                    hover
                    data-selected={selected || undefined}
                    className={cn(
                      isHidden && "bg-warning/[0.04]",
                      selected && "bg-primary/[0.06] hover:bg-primary/[0.09] dark:bg-primary/15 dark:hover:bg-primary/20"
                    )}
                  >
                    <Table.Td className="w-10 !pr-0">
                      <Checkbox
                        label={`Selecionar avaliação “${review.title}”`}
                        checked={selected}
                        onChange={() => toggleSelected(review.id)}
                      />
                    </Table.Td>
                    <Table.Td className="min-w-[15rem] max-w-sm">
                      <button
                        type="button"
                        onClick={() => openDetail(review.id)}
                        className={cn(
                          "block rounded text-left font-medium text-black hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white dark:hover:text-primary-light",
                          isHidden && "text-body dark:text-bodydark1"
                        )}
                      >
                        {review.title}
                        <span className="sr-only"> (abrir detalhes)</span>
                      </button>
                      <span className={cn("text-body dark:text-bodydark", density === "compact" ? "line-clamp-1" : "line-clamp-2")}>
                        {review.description}
                      </span>
                      {review.photos.length > 0 && density !== "compact" && (
                        <div className="mt-2">
                          <ReviewPhotos
                            photos={review.photos}
                            reviewTitle={review.title}
                            onOpen={(index) => openLightbox(review.id, index)}
                          />
                        </div>
                      )}
                      {review.reply && (
                        <button
                          type="button"
                          onClick={() => openDetail(review.id, "reply")}
                          className="mt-1.5 flex max-w-full items-start gap-1.5 border-l-2 border-primary/50 pl-2 text-left text-xs text-body hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-primary-light/60 dark:text-bodydark dark:hover:text-primary-light"
                        >
                          <MessageSquareReply size={12} aria-hidden="true" className="mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <span className="font-medium text-black dark:text-bodydark1">Resposta da equipe:</span>{" "}
                            {review.reply.text}
                          </span>
                        </button>
                      )}
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-body dark:text-bodydark">
                        <span className="inline-flex items-center gap-1" title="Marcações de “útil”">
                          <ThumbsUp size={12} aria-hidden="true" />
                          {review.helpfulCount ?? 0}
                          <span className="sr-only">{review.helpfulCount === 1 ? "pessoa achou útil" : "pessoas acharam útil"}</span>
                        </span>
                        {review.photos.length > 0 && density === "compact" && (
                          <button
                            type="button"
                            onClick={() => openLightbox(review.id, 0)}
                            className="rounded hover:text-primary hover:underline dark:hover:text-primary-light"
                          >
                            {review.photos.length} {review.photos.length === 1 ? "foto" : "fotos"}
                          </button>
                        )}
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
                      <div className="flex flex-col items-start gap-1">
                        <Badge color={statusMeta.color}>
                          {isHidden ? <EyeOff size={12} aria-hidden="true" /> : <Eye size={12} aria-hidden="true" />}
                          {statusMeta.label}
                        </Badge>
                        {review.reportsCount > 0 && (
                          <button
                            type="button"
                            onClick={() => openDetail(review.id, "reports")}
                            className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-danger/20 dark:text-danger-light dark:hover:bg-danger/30"
                          >
                            <Flag size={12} aria-hidden="true" />
                            {reportsLabel(review.reportsCount)}
                            <span className="sr-only">: ver denúncias da avaliação “{review.title}”</span>
                          </button>
                        )}
                      </div>
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
                      {!isHidden && review.moderatedAt && density !== "compact" && (
                        <span className="mt-1 block text-xs text-body dark:text-bodydark">
                          Restaurada por {review.moderatedByName ?? "administrador"} ·{" "}
                          <time dateTime={review.moderatedAt} title={formatDateTime(review.moderatedAt)}>
                            {formatRelativeTime(review.moderatedAt)}
                          </time>
                        </span>
                      )}
                    </Table.Td>
                    <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark 2xl:table-cell">
                      <time dateTime={review.createdAt} title={formatRelativeTime(review.createdAt)}>
                        {formatDateTime(review.createdAt)}
                      </time>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        {isHidden ? (
                          <IconButton
                            tooltipAlign="end"
                            label={`Restaurar avaliação “${review.title}”`}
                            onClick={() => requestRestore({ id: review.id, title: review.title })}
                          >
                            <Eye size={18} />
                          </IconButton>
                        ) : (
                          <IconButton
                            tooltipAlign="end"
                            label={`Ocultar avaliação “${review.title}”`}
                            onClick={() => requestHide({ id: review.id, title: review.title, reportsCount: review.reportsCount })}
                          >
                            <EyeOff size={18} />
                          </IconButton>
                        )}
                        <IconButton
                          tooltipAlign="end"
                          label={review.reply ? `Ver resposta à avaliação “${review.title}”` : `Responder avaliação “${review.title}”`}
                          onClick={() => openDetail(review.id, "reply")}
                        >
                          <MessageSquareReply size={18} />
                        </IconButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label={`Mais ações para “${review.title}”`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-body hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary dark:text-bodydark dark:hover:bg-primary/20 dark:hover:text-primary-light"
                          >
                            <MoreHorizontal size={18} aria-hidden="true" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => openDetail(review.id)}>
                              <PanelRightOpen size={16} aria-hidden="true" />
                              Ver detalhes
                            </DropdownMenuItem>
                            {review.reportsCount > 0 && (
                              <DropdownMenuItem onSelect={() => openDetail(review.id, "reports")}>
                                <Flag size={16} aria-hidden="true" />
                                Ver denúncias ({review.reportsCount})
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => goToEdit(review.id)}>
                              <Pencil size={16} aria-hidden="true" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => handleDeleteRequest({ id: review.id, name: review.title })}
                              className="text-danger data-[highlighted]:bg-danger/10 data-[highlighted]:text-danger dark:text-danger-light dark:data-[highlighted]:text-danger-light"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      {/* espaço para a barra de lote não cobrir a paginação */}
      {selectedCount > 0 && <div aria-hidden="true" className="h-28 sm:h-20" />}

      <BulkActionBar
        count={selectedCount}
        hideCount={bulkHideCount}
        restoreCount={bulkRestoreCount}
        onHide={requestBulkHide}
        onRestore={requestBulkRestore}
        onClear={clearSelection}
        isBusy={isModerating}
      />

      <ReviewDetailPanel {...props} />

      <HideReviewModal
        isOpen={moderationTarget?.action === "hide"}
        reviewTitle={moderationTarget?.title}
        count={moderationTarget?.bulk ? moderationTarget.ids.length : undefined}
        reasonField={reasonField}
        reasonError={reasonError}
        reasonLength={reasonLength}
        isLoading={isModerating}
        onSubmit={submitHide}
        onClose={cancelModeration}
        onPickReason={pickReason}
        note={
          moderationTarget?.reportsCount
            ? `${reportsLabel(moderationTarget.reportsCount)} ${moderationTarget.reportsCount === 1 ? "será resolvida" : "serão resolvidas"} junto.`
            : undefined
        }
      />

      <ConfirmModal
        isOpen={moderationTarget?.action === "restore"}
        tone="primary"
        irreversible={false}
        title={
          moderationTarget?.bulk
            ? `Restaurar ${restoreCount} ${restoreCount === 1 ? "avaliação" : "avaliações"}`
            : "Restaurar avaliação"
        }
        message={
          moderationTarget?.bulk ? (
            <>
              {restoreCount === 1
                ? "A avaliação oculta selecionada volta"
                : `As ${restoreCount} avaliações ocultas selecionadas voltam`}{" "}
              a aparecer no site e a contar nas notas médias. Os motivos da moderação serão apagados.
            </>
          ) : (
            <>
              A avaliação <strong className="text-black dark:text-white">“{moderationTarget?.title}”</strong> volta a
              aparecer no site e a contar nas notas médias. O motivo da moderação será apagado.
            </>
          )
        }
        confirmLabel="Restaurar"
        loadingLabel="Restaurando..."
        isLoading={isModerating}
        onConfirm={confirmRestore}
        onClose={cancelModeration}
      />

      <ConfirmModal
        isOpen={!!pendingConfirm}
        tone={pendingConfirm?.kind === "dismiss-reports" ? "primary" : "danger"}
        irreversible={pendingConfirm?.kind !== "dismiss-reports"}
        title={
          pendingConfirm?.kind === "dismiss-reports"
            ? "Descartar denúncias"
            : pendingConfirm?.kind === "delete-reply"
              ? "Remover resposta oficial"
              : "Remover foto"
        }
        message={
          pendingConfirm?.kind === "dismiss-reports" ? (
            <>
              {reportsLabel(pendingConfirm.count)} da avaliação{" "}
              <strong className="text-black dark:text-white">“{pendingConfirm.title}”</strong>{" "}
              {pendingConfirm.count === 1 ? "será descartada" : "serão descartadas"}. A avaliação continua visível no
              site.
            </>
          ) : pendingConfirm?.kind === "delete-reply" ? (
            <>
              A resposta da equipe deixa de aparecer abaixo da avaliação{" "}
              <strong className="text-black dark:text-white">“{pendingConfirm.title}”</strong>.
            </>
          ) : (
            <>
              A foto será apagada da avaliação{" "}
              <strong className="text-black dark:text-white">“{pendingConfirm?.title}”</strong> e do armazenamento.
            </>
          )
        }
        confirmLabel={pendingConfirm?.kind === "dismiss-reports" ? "Descartar" : "Remover"}
        loadingLabel={pendingConfirm?.kind === "dismiss-reports" ? "Descartando..." : "Removendo..."}
        isLoading={isConfirming}
        onConfirm={confirmPending}
        onClose={cancelPending}
      />

      <Lightbox
        isOpen={!!lightboxReview}
        title={lightboxReview ? `Fotos da avaliação “${lightboxReview.title}”` : ""}
        images={(lightboxReview?.photos ?? []).map((photo, index) => ({
          id: photo.id,
          src: photo.src,
          alt: `Foto ${index + 1} enviada por ${lightboxReview?.userName ?? "o autor"} na avaliação “${lightboxReview?.title}”`,
        }))}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={closeLightbox}
        onRemove={(image) => requestDeleteImage(Number(image.id))}
        isRemoving={isConfirming && pendingConfirm?.kind === "delete-image"}
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
