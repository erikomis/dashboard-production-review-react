import { api } from "@/shared/services/api";

/** POST /auth/sign-up — 201. Erros sobem como AxiosError (409 duplicado, 400 senha fora da política, 429). */
export const SignUpService = (name: string, email: string, username: string, password: string) =>
  api.request({
    url: "/auth/sign-up",
    method: "POST",
    data: { name, email, username, password },
  });
