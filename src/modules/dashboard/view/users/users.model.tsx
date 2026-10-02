import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useMutationSetUserActive,
  useMutationSetUserAdmin,
  useQueryAdminUsers,
} from "@/modules/dashboard/hooks/useAdminUsers";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { AdminUser } from "@/shared/types/admin";
import { getErrorMessage } from "@/shared/utils/error-message";
import { userFiltersSchema } from "./users.schema";
import { isAdminUser, USER_ACTION_COPY } from "./users.helpers";
import { UserAction, UserActionTarget } from "./users.type";

const PAGE_SIZE = 10;

export const useUsersModel = () => {
  const { data: me } = useMeQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(0, Number(searchParams.get("page") ?? "1") - 1) || 0;
  const search = searchParams.get("search") ?? "";
  const { role, active } = userFiltersSchema.parse({
    role: searchParams.get("role") ?? undefined,
    active: searchParams.get("active") ?? undefined,
  });

  const updateParams = (changes: Record<string, string | undefined>) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        next.delete("page");
        return next;
      },
      { replace: true }
    );

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  useEffect(() => {
    if (debouncedSearch.trim() === search) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch.trim()) next.set("search", debouncedSearch.trim());
        else next.delete("search");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, search, setSearchParams]);

  const { data, isLoading, isError, isFetching, refetch } = useQueryAdminUsers({
    page,
    size: PAGE_SIZE,
    search,
    role,
    active,
  });

  const setAdmin = useMutationSetUserAdmin();
  const setActive = useMutationSetUserActive();
  const isSaving = setAdmin.isPending || setActive.isPending;

  const [target, setTarget] = useState<UserActionTarget | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const requestAction = (user: AdminUser, action: UserAction) => setTarget({ user, action });
  const cancelAction = () => {
    if (!isSaving) setTarget(null);
  };

  const confirmAction = async () => {
    if (!target) return;
    const { user, action } = target;
    try {
      if (action === "grant-admin" || action === "revoke-admin") {
        await setAdmin.mutateAsync({ id: user.id, admin: action === "grant-admin" });
      } else {
        await setActive.mutateAsync({ id: user.id, active: action === "activate" });
      }
      const message = USER_ACTION_COPY[action].success(user.name);
      toast.success(message);
      setAnnouncement(message);
    } catch (error) {
      // 400 do backend (ex.: alterar a si mesmo) vira toast com a mensagem dele
      toast.error(getErrorMessage(error, "Não foi possível atualizar o usuário."));
    } finally {
      setTarget(null);
    }
  };

  const setPage = (nextPage: number) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextPage > 0) next.set("page", String(nextPage + 1));
      else next.delete("page");
      return next;
    });

  const hasFilters = !!(search || role || active !== undefined);

  return {
    users: (data?.content ?? []).map((user) => ({
      ...user,
      isAdmin: isAdminUser(user),
      isMe: !!me && me.id === user.id,
    })),
    page,
    setPage,
    pageSize: PAGE_SIZE,
    totalPages: data?.page.totalPages ?? 0,
    totalElements: data?.page.totalElements ?? 0,
    search,
    searchInput,
    setSearchInput,
    role: role ?? "",
    setRole: (value: string) => updateParams({ role: value || undefined }),
    active: active === undefined ? "" : String(active),
    setActive: (value: string) => updateParams({ active: value || undefined }),
    hasFilters,
    clearFilters: () => {
      setSearchInput("");
      setSearchParams(new URLSearchParams(), { replace: true });
    },
    isLoading,
    isFetching,
    isError,
    refetch: () => void refetch(),
    target,
    targetCopy: target ? USER_ACTION_COPY[target.action] : null,
    isSaving,
    requestAction,
    cancelAction,
    confirmAction: () => void confirmAction(),
    announcement,
  };
};
