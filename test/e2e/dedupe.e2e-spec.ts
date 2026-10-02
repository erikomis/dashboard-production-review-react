import { expect, expectToast, mockedOnly, test } from "./support/test";

test.describe("Remover duplicados", () => {
  test.beforeEach(async ({ loginAs }) => loginAs("admin"));

  test("confirma e mostra o resumo com grupos, removidos e links", async ({ page, api }) => {
    mockedOnly();
    await page.goto("/dashboard/import");
    const card = page.getByRole("region", { name: "Remover duplicados" });
    await card.getByRole("button", { name: "Remover duplicados" }).click();

    const confirm = page.getByRole("alertdialog", { name: "Remover produtos duplicados" });
    await expect(confirm).toContainText("sem avaliações");
    await confirm.getByRole("button", { name: "Cancelar" }).click();
    expect(api.callsTo("POST", "/admin/catalog/deduplicate")).toHaveLength(0);

    await card.getByRole("button", { name: "Remover duplicados" }).click();
    await page.getByRole("alertdialog", { name: "Remover produtos duplicados" }).getByRole("button", { name: "Remover duplicados" }).click();
    await expectToast(page, "3 produtos duplicados removidos em 2 grupos.");
    expect(api.callsTo("POST", "/admin/catalog/deduplicate")).toHaveLength(1);

    const summary = card.getByRole("group", { name: "Duplicados removidos" });
    await expect(summary.getByText("Grupos encontrados")).toBeVisible();
    await expect(summary.getByRole("link", { name: "#7 (abrir produto)" })).toHaveAttribute("href", "/dashboard/products/7");
    await expect(summary.getByRole("link", { name: "#53 (abrir produto)" })).toBeVisible();
    await expect(summary.getByText("#61")).toBeVisible();
  });
});
