import { productSchema, reviewSchema, subCategorySchema } from "./catalog.schema";

describe("catalog schemas", () => {
  it("subcategoria exige categorieId e converte o valor do select", () => {
    const ok = subCategorySchema.safeParse({
      name: "Celulares",
      slug: "celulares",
      description: "Smartphones",
      categorieId: "1",
    });
    expect(ok.success && ok.data.categorieId).toBe(1);

    const missing = subCategorySchema.safeParse({
      name: "Celulares",
      slug: "celulares",
      description: "Smartphones",
      categorieId: "",
    });
    expect(missing.success).toBe(false);
  });

  it("produto rejeita slug inválido", () => {
    const result = productSchema.safeParse({
      name: "Produto",
      slug: "Slug Inválido",
      description: "desc",
      subCategorieId: 1,
    });
    expect(result.success).toBe(false);
  });

  it("avaliação exige nota entre 1 e 5", () => {
    const base = { title: "Bom", description: "Gostei muito", productId: "2" };
    expect(reviewSchema.safeParse({ ...base, note: 0 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...base, note: 6 }).success).toBe(false);
    const ok = reviewSchema.safeParse({ ...base, note: 4 });
    expect(ok.success && ok.data).toEqual({ ...base, productId: 2, note: 4 });
  });
});
