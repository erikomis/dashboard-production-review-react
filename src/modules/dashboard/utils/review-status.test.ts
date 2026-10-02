import { getReviewStatusMeta, parseStatusFilter, statusFilterToParam } from "./review-status";

describe("review-status", () => {
  it("mapeia status para rótulo e cor do badge", () => {
    expect(getReviewStatusMeta("HIDDEN")).toEqual({ label: "Oculta", color: "warning" });
    expect(getReviewStatusMeta("VISIBLE")).toEqual({ label: "Visível", color: "success" });
    // API antiga, sem status: visível
    expect(getReviewStatusMeta(undefined).label).toBe("Visível");
  });

  it("lê o filtro da URL com segurança e converte para o parâmetro da API", () => {
    expect(parseStatusFilter("HIDDEN")).toBe("HIDDEN");
    expect(parseStatusFilter("hidden")).toBe("ALL");
    expect(parseStatusFilter(null)).toBe("ALL");
    expect(statusFilterToParam("ALL")).toBeUndefined();
    expect(statusFilterToParam("VISIBLE")).toBe("VISIBLE");
  });
});
