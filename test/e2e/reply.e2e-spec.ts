import { expect, expectToast, mockedOnly, test } from "./support/test";

test.describe("Resposta oficial", () => {
  test.beforeEach(async ({ loginAs }) => loginAs("admin"));

  test("escreve, publica, edita e remove a resposta de uma avaliação", async ({ page, api }) => {
    mockedOnly();
    await page.goto("/dashboard/review");
    await page.getByRole("button", { name: "Responder avaliação “Chegou quebrado”" }).click();

    const panel = page.getByRole("dialog", { name: "Chegou quebrado" });
    const field = panel.getByRole("textbox", { name: /Resposta oficial/ });
    await expect(field).toBeFocused();
    await panel.getByRole("button", { name: "Publicar resposta" }).click();
    await expect(panel.getByText("Escreva a resposta antes de publicar")).toBeVisible();

    const text = "Sentimos muito! Já acionamos a transportadora e a troca sai em 48 h.";
    await field.fill(text);
    await expect(panel.getByText(`${text.length}/1000 caracteres`)).toBeVisible();
    await panel.getByRole("button", { name: "Publicar resposta" }).click();
    await expectToast(page, "Resposta oficial publicada no site.");
    expect(api.callsTo("PUT", "/admin/reviews/7/reply")[0].body).toEqual({ text });

    // a resposta aparece no painel e na linha da tabela
    await expect(panel.getByText("Resposta da equipe ReviewStore", { exact: true })).toBeVisible();
    await expect(panel.getByText(text)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("row", { name: /Chegou quebrado/ }).getByText("Resposta da equipe:")).toBeVisible();

    // editar
    await page.getByRole("button", { name: "Ver resposta à avaliação “Chegou quebrado”" }).click();
    const edit = page.getByRole("dialog", { name: "Chegou quebrado" }).getByRole("textbox", { name: /Editar resposta/ });
    await expect(edit).toHaveValue(text);
    await edit.fill("Troca liberada. Obrigado pela paciência!");
    await page.getByRole("button", { name: "Salvar resposta" }).click();
    await expectToast(page, "Resposta oficial atualizada.");

    // remover (com confirmação)
    await page.getByRole("button", { name: "Remover", exact: true }).click();
    await page.getByRole("alertdialog", { name: "Remover resposta oficial" }).getByRole("button", { name: "Remover" }).click();
    await expectToast(page, "Resposta oficial removida.");
    expect(api.callsTo("DELETE", "/admin/reviews/7/reply")).toHaveLength(1);
  });

  test("fotos abrem no visualizador e o admin pode remover", async ({ page, api }) => {
    mockedOnly();
    await page.goto("/dashboard/review");
    await page.getByRole("button", { name: "Ampliar foto 1 de 2 da avaliação “Ótimo custo-benefício”" }).click();
    const viewer = page.getByRole("dialog", { name: "Fotos da avaliação “Ótimo custo-benefício”" });
    await expect(viewer.getByText("Foto 1 de 2")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(viewer.getByText("Foto 2 de 2")).toBeVisible();
    await viewer.getByRole("button", { name: "Remover foto" }).click();
    await page.getByRole("alertdialog", { name: "Remover foto" }).getByRole("button", { name: "Remover" }).click();
    await expectToast(page, "Foto removida da avaliação.");
    expect(api.callsTo("DELETE", "/review/10/images/22")).toHaveLength(1);
    await expect(viewer.getByText("Foto 1 de 1")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
  });
});
