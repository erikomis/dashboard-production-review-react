import { AdminUser } from "@/shared/types/admin";
import { UserAction } from "./users.type";

export const isAdminUser = (user: Pick<AdminUser, "roles">) => user.roles.includes("ADMIN");

export const ROLE_LABELS: Record<string, string> = { ADMIN: "Administrador", USER: "Usuário" };

/** Textos do modal de confirmação de cada ação. */
export const USER_ACTION_COPY: Record<
  UserAction,
  { title: string; confirm: string; loading: string; tone: "danger" | "primary"; success: (name: string) => string }
> = {
  "grant-admin": {
    title: "Tornar administrador",
    confirm: "Tornar admin",
    loading: "Salvando...",
    tone: "primary",
    success: (name) => `${name} agora é administrador.`,
  },
  "revoke-admin": {
    title: "Remover administrador",
    confirm: "Remover admin",
    loading: "Salvando...",
    tone: "danger",
    success: (name) => `${name} não é mais administrador.`,
  },
  deactivate: {
    title: "Desativar usuário",
    confirm: "Desativar",
    loading: "Desativando...",
    tone: "danger",
    success: (name) => `${name} foi desativado e não consegue mais entrar.`,
  },
  activate: {
    title: "Reativar usuário",
    confirm: "Reativar",
    loading: "Reativando...",
    tone: "primary",
    success: (name) => `${name} foi reativado.`,
  },
};

/** Por que a ação está bloqueada na própria linha (a API devolve 400 nesses casos). */
export const selfActionBlockedReason = (action: "admin" | "active") =>
  action === "admin"
    ? "Você não pode alterar o seu próprio perfil de administrador"
    : "Você não pode desativar a sua própria conta";
