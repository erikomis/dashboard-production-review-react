import { api } from "@/shared/services/api";
import { fetchCsv } from "@/shared/services/csv-export";
import { AdminUser, AdminUserPage } from "@/shared/types/admin";

export type AdminUserParams = {
  page?: number;
  size?: number;
  search?: string;
  /** `USER` = usuários sem o perfil ADMIN. */
  role?: "ADMIN" | "USER";
  active?: boolean;
};

export const AdminUsersService = {
  list: async ({ page = 0, size = 10, search, role, active }: AdminUserParams = {}) => {
    const response = await api.request<AdminUserPage>({
      method: "GET",
      url: "/admin/users",
      params: { page, size, search: search?.trim() || undefined, role, active },
    });
    return response.data;
  },

  /** 400 ao remover o próprio ADMIN. */
  setAdmin: async (id: number, admin: boolean) => {
    const response = await api.request<AdminUser>({
      method: "PATCH",
      url: `/admin/users/${id}/admin`,
      data: { admin },
    });
    return response.data;
  },

  /** 400 ao desativar a si mesmo. */
  setActive: async (id: number, active: boolean) => {
    const response = await api.request<AdminUser>({
      method: "PATCH",
      url: `/admin/users/${id}/active`,
      data: { active },
    });
    return response.data;
  },

  /** GET /admin/users/export.csv — mesmos filtros da lista. */
  exportCsv: ({ search, role, active }: Omit<AdminUserParams, "page" | "size">) =>
    fetchCsv("/admin/users/export.csv", { search: search?.trim(), role, active }, "usuarios"),
};
