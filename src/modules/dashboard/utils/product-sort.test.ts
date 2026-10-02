import { getImageSourceLabel, getProductSort, PRODUCT_SORT_OPTIONS } from "./product-sort";

describe("product-sort", () => {
  it("só usa propriedades aceitas pela API", () => {
    const allowed = ["name", "createdAt", "averageNote", "totalReviews"];
    for (const option of PRODUCT_SORT_OPTIONS) expect(allowed).toContain(option.property);
  });

  it("ranking por nota filtra só produtos avaliados", () => {
    expect(getProductSort("best")).toMatchObject({ property: "averageNote", sort: "DESC", onlyRated: true });
  });

  it("valor desconhecido volta ao padrão (mais recentes)", () => {
    expect(getProductSort("xyz").value).toBe("recent");
    expect(getProductSort(null).property).toBe("createdAt");
  });

  it("identifica a origem da imagem", () => {
    expect(getImageSourceLabel("https://images.openfoodfacts.org/images/x.jpg")).toBe("Open Food Facts");
    expect(getImageSourceLabel("http://localhost:9000/bucket/a.png")).toBe("localhost");
    expect(getImageSourceLabel("não é url")).toBeNull();
    expect(getImageSourceLabel(null)).toBeNull();
  });
});
