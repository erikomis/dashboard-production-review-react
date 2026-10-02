import { api } from "@/shared/services/api";

/** PATCH /auth/recovery-code/password — 204. Erros sobem como AxiosError (400 código/senha, 429). */
export const ResetPasswordService = (email: string, password: string, recoveryCode: string) =>
  api.request({
    url: "/auth/recovery-code/password",
    method: "PATCH",
    data: { email, password, recoveryCode },
  });
