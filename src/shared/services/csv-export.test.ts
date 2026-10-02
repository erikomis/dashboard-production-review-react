import { AxiosError, AxiosHeaders } from "axios";
import { api } from "./api";
import { fetchCsv } from "./csv-export";
import { getErrorMessage } from "@/shared/utils/error-message";

describe("fetchCsv", () => {
  afterEach(() => vi.restoreAllMocks());

  it("pede o CSV como blob, sem filtros vazios, e usa o nome do header", async () => {
    const request = vi.spyOn(api, "request").mockResolvedValue({
      data: new Blob(["a;b"]),
      headers: { "content-disposition": 'attachment; filename="avaliacoes-2026-10-02.csv"' },
    });
    const file = await fetchCsv("/admin/reviews/export.csv", { status: "HIDDEN", search: "", note: undefined }, "avaliacoes");
    expect(file.filename).toBe("avaliacoes-2026-10-02.csv");
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/admin/reviews/export.csv", params: { status: "HIDDEN" }, responseType: "blob" })
    );
  });

  it("sem Content-Disposition exposto, usa o nome padrão", async () => {
    vi.spyOn(api, "request").mockResolvedValue({ data: new Blob([""]), headers: {} });
    const file = await fetchCsv("/admin/users/export.csv", {}, "usuarios");
    expect(file.filename).toMatch(/^usuarios-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  it("converte o corpo de erro (Blob) em JSON para mostrar a mensagem da API", async () => {
    const error = new AxiosError("Forbidden", "ERR_BAD_REQUEST", undefined, undefined, {
      status: 403,
      statusText: "",
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: new Blob([JSON.stringify({ message: "Apenas administradores", statusCode: 403 })], { type: "application/json" }),
    });
    vi.spyOn(api, "request").mockRejectedValue(error);
    await expect(fetchCsv("/admin/activity/export.csv", {}, "atividade")).rejects.toBe(error);
    expect(getErrorMessage(error)).toBe("Apenas administradores");
  });
});
