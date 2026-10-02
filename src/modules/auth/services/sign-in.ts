import { api } from "@/shared/services/api";

type LoginProps = {
  username: string;
  password: string;
};

/**
 * POST /auth/sign-in — os cookies httpOnly vêm na resposta.
 * Erros sobem como AxiosError (status preservado: 401, 403, 429...) para o view-model tratar.
 */
export const SignInService = ({ username, password }: LoginProps) =>
  api.request<void>({
    url: "/auth/sign-in",
    method: "POST",
    data: { username, password },
  });
