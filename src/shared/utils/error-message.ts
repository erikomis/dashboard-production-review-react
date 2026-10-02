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
    if (status === 429) {
      const wait = getRetryAfterSeconds(error);
      if (wait !== null) return `Muitas tentativas. Tente novamente em ${formatWait(wait)}.`;
      return message || "Muitas tentativas. Aguarde um pouco e tente novamente.";
    }
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

/**
 * Segundos de espera de um 429: header `Retry-After` (quando a API o expõe via CORS)
 * ou, na falta dele, o número citado na mensagem ("Tente novamente em 42 segundos.").
 */
export const getRetryAfterSeconds = (error: unknown): number | null => {
  if (!isAxiosError(error) || error.response?.status !== 429) return null;
  const header = error.response.headers?.["retry-after"];
  const fromHeader = Number.parseInt(String(header ?? ""), 10);
  if (Number.isFinite(fromHeader) && fromHeader >= 0) return fromHeader;
  const data = error.response.data as Partial<ApiErrorBody> | undefined;
  const match = typeof data?.message === "string" ? /(\d+)\s*segundo/i.exec(data.message) : null;
  return match ? Number(match[1]) : null;
};

/** 1 → "1 segundo"; 42 → "42 segundos"; 125 → "2 minutos e 5 segundos". */
export const formatWait = (seconds: number) => {
  const total = Math.max(0, Math.ceil(seconds));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  const s = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  if (min === 0) return s(sec, "segundo", "segundos");
  if (sec === 0) return s(min, "minuto", "minutos");
  return `${s(min, "minuto", "minutos")} e ${s(sec, "segundo", "segundos")}`;
};

/** `message` do corpo de erro da API, se houver. */
export const getApiMessage = (error: unknown): string | null => {
  if (!isAxiosError(error)) return null;
  const data = error.response?.data as Partial<ApiErrorBody> | undefined;
  return typeof data?.message === "string" && data.message.trim() ? data.message.trim() : null;
};
