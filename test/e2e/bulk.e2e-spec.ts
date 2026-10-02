import { expect, expectToast, mockedOnly, test } from "./support/test";
import { chooseTab } from "./support/ui";

test.describe("Moderação em lote", () => {
  test.beforeEach(async ({ loginAs }) => loginAs("admin"));

  test("seleciona a página, oculta com motivo e depois restaura", async ({ page, api }) => {
    mockedOnly();
    await page.goto("/dashboard/review?status=VISIBLE");
    await expect(page.getByText("7 avaliações encontradas")).toBeVisible();

    await page.getByRole("checkbox", { name: "Selecionar todas as avaliações desta página" }).check({ force: true });
    const bar = page.getByRole("region", { name: "Ações em lote" });
    await expect(bar).toContainText("7 avaliações selecionadas");

    // desmarca uma
    await page.getByRole("checkbox", { name: "Selecionar avaliação “Bateria dura o dia todo”" }).uncheck({ force: true });
    await expect(bar).toContainText("6 avaliações selecionadas");
    await expect(page.getByRole("checkbox", { name: "Selecionar todas as avaliações desta página" })).toHaveAttribute("aria-checked", "mixed");

    await bar.getByRole("button", { name: "Ocultar selecionadas" }).click();
    const modal = page.getByRole("dialog", { name: "Ocultar 6 avaliações" });
    await modal.getByRole("button", { name: "Ocultar 6 avaliações" }).click();
    await expect(modal.getByText("Explique o motivo com pelo menos 3 caracteres")).toBeVisible();
    await modal.getByRole("button", { name: "Conteúdo fora do tema" }).click();
    await modal.getByRole("button", { name: "Ocultar 6 avaliações" }).click();

    await expectToast(page, "6 avaliações ocultadas.");
    const call = api.callsTo("PATCH", "/admin/reviews/moderation")[0];
    expect(call.body).toEqual({ ids: [12, 11, 10, 9, 8, 7], status: "HIDDEN", reason: "Conteúdo fora do tema" });
    await expect(bar).toBeHidden();
    await expect(page.getByText("1 avaliação encontrada")).toBeVisible();

    // restaurar na aba Ocultas
    await chooseTab(page, /Ocultas/);
    await expect(page.getByText("7 avaliações encontradas")).toBeVisible();
    await page.getByRole("checkbox", { name: "Selecionar avaliação “Chegou quebrado”" }).check({ force: true });
    await page.getByRole("checkbox", { name: "Selecionar avaliação “Café encorpado”" }).check({ force: true });
    await expect(bar).toContainText("2 avaliações selecionadas");
    await expect(bar.getByRole("button", { name: "Ocultar selecionadas" })).toBeDisabled();
    await bar.getByRole("button", { name: "Restaurar selecionadas" }).click();
    await page.getByRole("alertdialog", { name: "Restaurar 2 avaliações" }).getByRole("button", { name: "Restaurar" }).click();
    await expectToast(page, "2 avaliações restauradas.");
    expect(api.callsTo("PATCH", "/admin/reviews/moderation")[1].body).toEqual({ ids: [8, 7], status: "VISIBLE" });
  });
});
