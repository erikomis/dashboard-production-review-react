import { AxiosError, AxiosHeaders } from "axios";
import { getErrorMessage, getErrorStatus } from "./error-message";

const axiosError = (status: number, data?: unknown) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    data,
    headers: {},
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
