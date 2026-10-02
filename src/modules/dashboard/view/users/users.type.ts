import { AdminUser } from "@/shared/types/admin";

export type UserAction = "grant-admin" | "revoke-admin" | "deactivate" | "activate";

export type UserActionTarget = { user: AdminUser; action: UserAction };
