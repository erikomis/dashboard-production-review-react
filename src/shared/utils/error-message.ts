import { isAxiosError } from "axios";
import { ApiErrorBody } from "@/shared/types/api";

const FORBIDDEN_MESSAGE = "Você não tem permissão para realizar esta ação.";

/**
 * Extrai uma mensagem legível de um erro de requisição.
 * O backend devolve `{ message, statusCode }`; o filtro de segurança do Spring
 * devolve `{ message: "Access Denied", status: 403 }`.
 */
export const getErrorMessage = (
  error: unknown,
  fallback = "Ocorreu um erro inesperado. Tente novamente."
): string => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
    const { status } = error.response;
    const data = error.response.data as Partial<ApiErrorBody> | undefined;
    const message =
      data && typeof data === "object" && typeof data.message === "string"
        ? data.message.trim()
        : "";

    if (status === 401) return "Sua sessão expirou. Faça login novamente.";
    if (status === 403) {
      return message && message !== "Access Denied"
        ? message
        : FORBIDDEN_MESSAGE;
    }
    if (status >= 500) {
      return message ? `${fallback} (${message})` : fallback;
    }
    return message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const getErrorStatus = (error: unknown) =>
  isAxiosError(error) ? error.response?.status : undefined;
