import { api } from "@/shared/services/api";

/** POST /auth/send-recovery-code/send — 204. Erros sobem como AxiosError (404, 429). */
export const ForgotPasswordService = (email: string) =>
  api.request({
    url: "/auth/send-recovery-code/send",
    method: "POST",
    data: { email },
  });
