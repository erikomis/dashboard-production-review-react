import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { environment } from "@/environment/environment";

export const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Rotas de autenticação nunca disparam refresh/redirect (evita loops). */
const isAuthRequest = (url?: string) => !!url && url.includes("/auth/");

/** `/user/me` é tratado pelos guards de rota (ProtectedRouter / RouterAuth). */
const isMeRequest = (url?: string) => !!url && url.includes("/user/me");

let refreshPromise: Promise<void> | null = null;

/** Uma única renovação em andamento, compartilhada por todas as requisições 401. */
const refreshSession = () => {
  refreshPromise ??= api
    .post("/auth/refresh-token")
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (status !== 401 || !config || isAuthRequest(config.url)) {
      return Promise.reject(error);
    }

    // 1ª tentativa: renova os cookies com o refresh_token e repete a requisição.
    if (!config._retry) {
      config._retry = true;
      try {
        await refreshSession();
        return api.request(config);
      } catch {
        // refresh inválido: segue para o tratamento abaixo
      }
    }

    // Sessão perdida. Antes isto redirecionava em QUALQUER 401 (inclusive /user/me
    // na própria tela de login), causando loop de reload. Só redireciona quando o
    // usuário está dentro do dashboard e a falha não veio de /user/me.
    if (!isMeRequest(config.url) && window.location.pathname.startsWith("/dashboard")) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
