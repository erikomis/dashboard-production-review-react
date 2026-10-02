import { fallbackCsvName, filenameFromContentDisposition } from "./download";

describe("download", () => {
  it("lê o nome do arquivo do Content-Disposition", () => {
    expect(filenameFromContentDisposition('attachment; filename="avaliacoes-2026-10-02.csv"')).toBe("avaliacoes-2026-10-02.csv");
    expect(filenameFromContentDisposition("attachment; filename=usuarios.csv")).toBe("usuarios.csv");
    expect(filenameFromContentDisposition("attachment; filename*=UTF-8''atividade%20out.csv; filename=\"x.csv\"")).toBe(
      "atividade out.csv"
    );
    expect(filenameFromContentDisposition("attachment")).toBeNull();
    expect(filenameFromContentDisposition(undefined)).toBeNull();
  });

  it("nome padrão no mesmo formato da API quando o header não chega (CORS)", () => {
    expect(fallbackCsvName("avaliacoes", new Date(2026, 9, 2, 23, 59))).toBe("avaliacoes-2026-10-02.csv");
  });
});
