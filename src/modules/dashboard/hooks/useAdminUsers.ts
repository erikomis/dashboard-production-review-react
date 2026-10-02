import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  AdminUserParams,
  AdminUsersService,
} from "@/modules/dashboard/services/admin-users.service";
import { queryClient } from "@/shared/libs/react-query";

export const useQueryAdminUsers = (params: AdminUserParams) =>
  useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => AdminUsersService.list(params),
    placeholderData: keepPreviousData,
  });

const invalidate = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
  ]);

export const useMutationSetUserAdmin = () =>
  useMutation({
    mutationFn: ({ id, admin }: { id: number; admin: boolean }) => AdminUsersService.setAdmin(id, admin),
    onSuccess: invalidate,
  });

export const useMutationSetUserActive = () =>
  useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      AdminUsersService.setActive(id, active),
    onSuccess: invalidate,
  });
