import { activityPeriodSchema } from "./activity/activity.schema";
import { homePeriodSchema } from "./home/home.schema";
import { importCatalogSchema } from "./import-catalog/import-catalog.schema";
import { IMPORT_STEPS } from "./import-catalog/import-catalog.type";
import { productListFiltersSchema } from "./product-list/product-list.schema";
import { hideReviewSchema, reviewFiltersSchema } from "./review-list/review-list.schema";
import { userFiltersSchema } from "./users/users.schema";

describe("schemas da fase 2", () => {
  it("ocultar exige motivo de 3 a 255 caracteres (sem contar espaços nas pontas)", () => {
    expect(hideReviewSchema.safeParse({ reason: "  spam  " }).success).toBe(true);
    const empty = hideReviewSchema.safeParse({ reason: "   " });
    expect(empty.success).toBe(false);
    expect(!empty.success && empty.error.issues[0].message).toMatch(/pelo menos 3/);
    expect(hideReviewSchema.safeParse({ reason: "x".repeat(256) }).success).toBe(false);
  });

  it("filtros de avaliação descartam valores inválidos da URL", () => {
    expect(reviewFiltersSchema.parse({ note: "4", productId: "12" })).toEqual({ note: 4, productId: 12 });
    expect(reviewFiltersSchema.parse({ note: "9", productId: "abc" })).toEqual({ note: undefined, productId: undefined });
  });

  it("importação aceita 1 a 30 produtos por subcategoria", () => {
    expect(importCatalogSchema.parse({ productsPerSubcategory: "12" }).productsPerSubcategory).toBe(12);
    expect(importCatalogSchema.safeParse({ productsPerSubcategory: 0 }).success).toBe(false);
    expect(importCatalogSchema.safeParse({ productsPerSubcategory: 31 }).success).toBe(false);
    expect(importCatalogSchema.safeParse({ productsPerSubcategory: 2.5 }).success).toBe(false);
    expect(importCatalogSchema.safeParse({ productsPerSubcategory: "abc" }).success).toBe(false);
    expect(IMPORT_STEPS).toBe(12);
  });

  it("período da atividade: inicial não pode passar da final", () => {
    expect(activityPeriodSchema.safeParse({ from: "2026-09-01", to: "2026-10-02" }).success).toBe(true);
    expect(activityPeriodSchema.safeParse({ from: "2026-10-02", to: "2026-10-02" }).success).toBe(true);
    const inverted = activityPeriodSchema.safeParse({ from: "2026-10-05", to: "2026-10-02" });
    expect(inverted.success).toBe(false);
    expect(!inverted.success && inverted.error.issues[0].path).toEqual(["to"]);
    expect(activityPeriodSchema.safeParse({ from: "", to: "" }).success).toBe(true);
    expect(activityPeriodSchema.safeParse({ from: "02/10/2026" }).success).toBe(false);
  });

  it("usuários: perfil e situação da URL", () => {
    expect(userFiltersSchema.parse({ role: "ADMIN", active: "false" })).toEqual({ role: "ADMIN", active: false });
    expect(userFiltersSchema.parse({ role: "ROOT", active: "talvez" })).toEqual({ role: undefined, active: undefined });
  });

  it("produtos: ids positivos e ordenação conhecida", () => {
    expect(productListFiltersSchema.parse({ categoryId: "5", subCategorieId: "x", order: "best" })).toEqual({
      categoryId: 5,
      subCategorieId: undefined,
      order: "best",
    });
    expect(productListFiltersSchema.parse({ order: "hack" }).order).toBe("recent");
  });

  it("visão geral: período 7/30/90, padrão 30", () => {
    expect(homePeriodSchema.parse("7")).toBe(7);
    expect(homePeriodSchema.parse("45")).toBe(30);
    expect(homePeriodSchema.parse(undefined)).toBe(30);
  });
});
