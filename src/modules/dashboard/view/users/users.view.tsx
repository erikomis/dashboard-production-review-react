import { FilterX, ShieldCheck, ShieldMinus, ShieldPlus, UserCheck, Users, UserX } from "lucide-react";
import { Table } from "@/modules/dashboard/components/table";
import { Pagination } from "@/modules/dashboard/components/pagination/Pagination";
import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { SearchInput } from "@/modules/dashboard/components/form/SearchInput";
import { FilterSelect } from "@/modules/dashboard/components/form/FilterSelect";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { IconButton } from "@/shared/components/icon-button";
import { formatDate, initials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { ROLE_LABELS, selfActionBlockedReason } from "./users.helpers";
import { useUsersModel } from "./users.model";

const COLUMNS = 7;

type UsersViewProps = ReturnType<typeof useUsersModel>;

/** Ação bloqueada: continua focável (aria-disabled) para o tooltip explicar o motivo. */
const BlockedAction = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <IconButton
    label={label}
    aria-disabled="true"
    tooltipAlign="end"
    onClick={(event) => event.preventDefault()}
    className="cursor-not-allowed hover:bg-transparent hover:text-body dark:hover:bg-transparent dark:hover:text-bodydark"
  >
    <span className="block opacity-40">{children}</span>
  </IconButton>
);

export const UsersView = ({
  users,
  page,
  setPage,
  pageSize,
  totalPages,
  totalElements,
  search,
  searchInput,
  setSearchInput,
  role,
  setRole,
  active,
  setActive,
  hasFilters,
  clearFilters,
  isLoading,
  isFetching,
  isError,
  refetch,
  target,
  targetCopy,
  isSaving,
  requestAction,
  cancelAction,
  confirmAction,
  announcement,
}: UsersViewProps) => (
  <>
    <PageHeader
      title="Usuários"
      description="Contas cadastradas no site. Conceda ou remova o perfil de administrador e desative contas quando necessário."
      breadcrumbs={[{ label: "Usuários" }]}
    />

    <span className="sr-only" role="status" aria-live="polite">
      {announcement}
    </span>

    <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-4 border-b border-stroke px-5 py-4 dark:border-strokedark sm:px-6">
        <div role="group" aria-label="Filtros de usuários" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="mb-1.5 block text-xs font-medium text-body dark:text-bodydark" aria-hidden="true">
              Busca
            </span>
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              label="Buscar por nome, usuário ou e-mail"
              placeholder="Nome, usuário ou e-mail..."
              className="sm:max-w-none"
            />
          </div>
          <FilterSelect label="Perfil" value={role} onValueChange={setRole}>
            <option value="">Todos os perfis</option>
            <option value="ADMIN">Administradores</option>
            <option value="USER">Sem perfil de admin</option>
          </FilterSelect>
          <FilterSelect label="Situação" value={active} onValueChange={setActive}>
            <option value="">Ativos e inativos</option>
            <option value="true">Só ativos</option>
            <option value="false">Só inativos</option>
          </FilterSelect>
          {hasFilters && (
            <Button color="ghost" onClick={clearFilters} leftIcon={<FilterX size={16} aria-hidden="true" />}>
              Limpar filtros
            </Button>
          )}
        </div>
        <p className="text-sm text-body dark:text-bodydark" aria-live="polite">
          {isLoading
            ? "Carregando usuários..."
            : `${totalElements} ${totalElements === 1 ? "usuário" : "usuários"}${search ? ` para “${search}”` : ""}`}
        </p>
      </div>

      <Table.Root
        caption="Lista de usuários"
        aria-busy={isFetching || undefined}
        className={cn("w-full table-auto text-left text-sm transition-opacity", isFetching && !isLoading && "opacity-60")}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Usuário</Table.Th>
            <Table.Th className="hidden lg:table-cell">E-mail</Table.Th>
            <Table.Th>Perfis</Table.Th>
            <Table.Th>Situação</Table.Th>
            <Table.Th className="hidden md:table-cell">Criado em</Table.Th>
            <Table.Th className="hidden text-right sm:table-cell">Avaliações</Table.Th>
            <Table.Th className="text-right">
              <span className="sr-only sm:not-sr-only">Ações</span>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading && <Table.LoadingRows columns={COLUMNS} rows={4} />}

          {isError && (
            <Table.MessageRow columns={COLUMNS}>
              <ErrorState title="Erro ao carregar usuários" onRetry={refetch} />
            </Table.MessageRow>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <Table.MessageRow columns={COLUMNS}>
              <EmptyState
                icon={<Users size={30} aria-hidden="true" />}
                title="Nenhum usuário encontrado"
                description={hasFilters ? "Nenhuma conta corresponde aos filtros escolhidos." : "Ainda não há contas cadastradas."}
                action={hasFilters ? <Button color="outline" onClick={clearFilters}>Limpar filtros</Button> : undefined}
              />
            </Table.MessageRow>
          )}

          {!isLoading &&
            !isError &&
            users.map((user) => (
              <Table.Tr key={user.id} hover className={cn(!user.active && "bg-gray-2/60 dark:bg-meta-4/30")}>
                <Table.Td>
                  <span className="flex min-w-[12rem] items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        user.isAdmin
                          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                          : "bg-gray text-black dark:bg-meta-4 dark:text-white"
                      )}
                    >
                      {initials(user.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-medium text-black dark:text-white">
                        {user.name}
                        {user.isMe && <Badge color="neutral">Você</Badge>}
                      </span>
                      <span className="block text-xs text-body dark:text-bodydark">@{user.username}</span>
                      <span className="block truncate text-xs text-body dark:text-bodydark lg:hidden">{user.email}</span>
                    </span>
                  </span>
                </Table.Td>
                <Table.Td className="hidden text-body dark:text-bodydark lg:table-cell">{user.email}</Table.Td>
                <Table.Td>
                  <span className="flex flex-wrap gap-1">
                    {user.isAdmin && (
                      <Badge color="primary">
                        <ShieldCheck size={12} aria-hidden="true" />
                        {ROLE_LABELS.ADMIN}
                      </Badge>
                    )}
                    {user.roles
                      .filter((r) => r !== "ADMIN")
                      .map((r) => (
                        <Badge key={r} color="neutral">
                          {ROLE_LABELS[r] ?? r}
                        </Badge>
                      ))}
                  </span>
                </Table.Td>
                <Table.Td>
                  <Badge color={user.active ? "success" : "danger"}>
                    <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", user.active ? "bg-success" : "bg-danger")} />
                    {user.active ? "Ativo" : "Inativo"}
                  </Badge>
                </Table.Td>
                <Table.Td className="hidden whitespace-nowrap text-body dark:text-bodydark md:table-cell">
                  {formatDate(user.createdAt)}
                </Table.Td>
                <Table.Td className="hidden text-right tabular-nums sm:table-cell">{user.reviewsCount}</Table.Td>
                <Table.Td>
                  <div className="flex items-center justify-end gap-1">
                    {user.isMe ? (
                      <BlockedAction label={selfActionBlockedReason("admin")}>
                        <ShieldMinus size={18} />
                      </BlockedAction>
                    ) : user.isAdmin ? (
                      <IconButton tooltipAlign="end" label={`Remover administrador de ${user.name}`} color="danger" onClick={() => requestAction(user, "revoke-admin")}>
                        <ShieldMinus size={18} />
                      </IconButton>
                    ) : (
                      <IconButton tooltipAlign="end" label={`Tornar ${user.name} administrador`} onClick={() => requestAction(user, "grant-admin")}>
                        <ShieldPlus size={18} />
                      </IconButton>
                    )}
                    {user.isMe ? (
                      <BlockedAction label={selfActionBlockedReason("active")}>
                        <UserX size={18} />
                      </BlockedAction>
                    ) : user.active ? (
                      <IconButton tooltipAlign="end" label={`Desativar ${user.name}`} color="danger" onClick={() => requestAction(user, "deactivate")}>
                        <UserX size={18} />
                      </IconButton>
                    ) : (
                      <IconButton tooltipAlign="end" label={`Reativar ${user.name}`} onClick={() => requestAction(user, "activate")}>
                        <UserCheck size={18} />
                      </IconButton>
                    )}
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
          itemLabel="usuários"
        />
      )}
    </div>

    <ConfirmModal
      isOpen={!!target}
      title={targetCopy?.title ?? ""}
      tone={targetCopy?.tone}
      irreversible={false}
      confirmLabel={targetCopy?.confirm}
      loadingLabel={targetCopy?.loading}
      isLoading={isSaving}
      onConfirm={confirmAction}
      onClose={cancelAction}
      message={
        target && (
          <>
            {target.action === "grant-admin" && (
              <>
                <strong className="text-black dark:text-white">{target.user.name}</strong> poderá gerenciar o catálogo,
                moderar avaliações e alterar outros usuários.
              </>
            )}
            {target.action === "revoke-admin" && (
              <>
                <strong className="text-black dark:text-white">{target.user.name}</strong> perderá o acesso a este
                painel e continuará como usuário comum.
              </>
            )}
            {target.action === "deactivate" && (
              <>
                <strong className="text-black dark:text-white">{target.user.name}</strong> não conseguirá mais entrar e
                a sessão atual dele deixa de valer imediatamente. As avaliações continuam publicadas.
              </>
            )}
            {target.action === "activate" && (
              <>
                <strong className="text-black dark:text-white">{target.user.name}</strong> voltará a conseguir entrar
                no site.
              </>
            )}
          </>
        )
      }
    />
  </>
);
