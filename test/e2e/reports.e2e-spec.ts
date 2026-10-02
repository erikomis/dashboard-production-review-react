import { expect, expectToast, mockedOnly, test } from "./support/test";
import { chooseTab } from "./support/ui";

test.describe("Denúncias", () => {
  test.beforeEach(async ({ loginAs }) => loginAs("admin"));

  test("filtra denunciadas, vê as denúncias, descarta e oculta", async ({ page, api }) => {
    mockedOnly();
    await page.goto("/dashboard/review");
    const tab = page.getByRole("radio", { name: /Denunciadas/ });
    await expect(tab).toHaveAccessibleName(/2 avaliações/);
    await chooseTab(page, /Denunciadas/);
    await expect(page).toHaveURL(/status=REPORTED/);
    await expect(page.getByText("2 avaliações encontradas")).toBeVisible();
    expect(api.callsTo("GET", "/admin/reviews").some((c) => c.query.get("reported") === "true" && c.query.get("size") === "10")).toBe(true);

    // badge da linha abre o painel com as denúncias
    await page.getByRole("button", { name: /3 denúncias.*ver denúncias da avaliação “Promoção imperdível”/ }).click();
    const panel = page.getByRole("dialog", { name: "Promoção imperdível" });
    await expect(panel.getByRole("heading", { name: "Denúncias (3)" })).toBeVisible();
    await expect(panel.getByText("“Propaganda de outra loja com link.”")).toBeVisible();
    await expect(panel.getByText(/Denunciada por\s+Carlos Mendes/)).toBeVisible();
    await expect(panel.getByText("Informação falsa", { exact: true })).toBeVisible();

    // Ocultar resolve as denúncias, com motivo sugerido pelas denúncias
    await panel.getByRole("button", { name: "Ocultar", exact: true }).click();
    const hide = page.getByRole("dialog", { name: "Ocultar avaliação" });
    await expect(hide.getByText("3 denúncias serão resolvidas junto.")).toBeVisible();
    await expect(hide.getByRole("textbox", { name: /Motivo/ })).toHaveValue("Ocultada após 3 denúncias (spam).");
    await hide.getByRole("button", { name: "Ocultar avaliação" }).click();
    await expectToast(page, "Avaliação “Promoção imperdível” ocultada do site. 3 denúncias resolvidas.");
    expect(api.callsTo("PATCH", "/admin/reviews/12/moderation")[0].body).toEqual({
      status: "HIDDEN",
      reason: "Ocultada após 3 denúncias (spam).",
    });

    // A outra denunciada: descartar mantém visível
    await expect(page.getByText("1 avaliação encontrada")).toBeVisible();
    await page.getByRole("button", { name: /Mais ações para “Produto horrível, vendedor idiota”/ }).click();
    await page.getByRole("menuitem", { name: "Ver denúncias (1)" }).click();
    const panel2 = page.getByRole("dialog", { name: "Produto horrível, vendedor idiota" });
    await expect(panel2.getByText("“Ofende o vendedor.”")).toBeVisible();
    await panel2.getByRole("button", { name: "Descartar denúncias" }).click();
    const confirm = page.getByRole("alertdialog", { name: "Descartar denúncias" });
    await confirm.getByRole("button", { name: "Descartar" }).click();
    await expectToast(page, "1 denúncia descartada. A avaliação continua visível.");
    expect(api.callsTo("DELETE", "/admin/reviews/11/reports")).toHaveLength(1);

    await expect(page.getByRole("heading", { name: "Nenhuma denúncia aberta" })).toBeVisible();
    await expect(tab).toHaveAccessibleName(/0 avaliações/);
  });

  test("a aba Denunciadas é navegável e mostra contadores", async ({ page }) => {
    await page.goto("/dashboard/review?status=REPORTED");
    await expect(page.getByRole("heading", { level: 1, name: "Avaliações" })).toBeVisible();
    await expect(page.getByRole("radio", { name: /Denunciadas/ })).toBeChecked();
    await expect(page.getByRole("table")).toBeVisible();
  });
});
