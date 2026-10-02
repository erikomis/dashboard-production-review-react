import { AxiosError, AxiosHeaders } from "axios";
import { formatWait, getErrorMessage, getErrorStatus, getRetryAfterSeconds } from "./error-message";

const axiosError = (status: number, data?: unknown, headers: Record<string, string> = {}) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    data,
    headers,
    config: { headers: new AxiosHeaders() },
  });

describe("getErrorMessage", () => {
  it("usa a message do backend ({message, statusCode})", () => {
    const error = axiosError(409, { message: "Categorie already exists", statusCode: 409 });
    expect(getErrorMessage(error)).toBe("Categorie already exists");
    expect(getErrorStatus(error)).toBe(409);
  });

  it("traduz o 403 genérico do Spring Security", () => {
    const error = axiosError(403, { message: "Access Denied", status: 403 });
    expect(getErrorMessage(error)).toBe("Você não tem permissão para realizar esta ação.");
  });

  it("anexa o detalhe em erros 5xx", () => {
    expect(getErrorMessage(axiosError(500, { message: "MinIO offline" }), "Falha no upload.")).toBe(
      "Falha no upload. (MinIO offline)"
    );
  });

  it("usa o fallback quando não há corpo", () => {
    expect(getErrorMessage(axiosError(400), "Erro X")).toBe("Erro X");
  });

  it("trata falha de rede e Error comum", () => {
    expect(getErrorMessage(new AxiosError("Network Error"))).toMatch(/conectar ao servidor/);
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });
});

describe("rate limit (429)", () => {
  const body = { message: "Muitas tentativas. Tente novamente em 42 segundos.", httpStatus: "TOO_MANY_REQUESTS", statusCode: 429 };

  it("usa o Retry-After quando o header está disponível", () => {
    const error = axiosError(429, body, { "retry-after": "75" });
    expect(getRetryAfterSeconds(error)).toBe(75);
    expect(getErrorMessage(error)).toBe("Muitas tentativas. Tente novamente em 1 minuto e 15 segundos.");
  });

  it("sem o header (CORS), lê o tempo da mensagem da API", () => {
    const error = axiosError(429, body);
    expect(getRetryAfterSeconds(error)).toBe(42);
    expect(getErrorMessage(error)).toBe("Muitas tentativas. Tente novamente em 42 segundos.");
  });

  it("sem tempo nenhum, mostra a mensagem genérica", () => {
    expect(getRetryAfterSeconds(axiosError(429))).toBeNull();
    expect(getErrorMessage(axiosError(429))).toMatch(/Muitas tentativas/);
    expect(getRetryAfterSeconds(axiosError(400, body))).toBeNull();
  });

  it("formata o tempo de espera", () => {
    expect(formatWait(1)).toBe("1 segundo");
    expect(formatWait(60)).toBe("1 minuto");
    expect(formatWait(125)).toBe("2 minutos e 5 segundos");
  });
});
