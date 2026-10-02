import { expect, expectToast, isRealApi, test } from "./support/test";

test.describe("Exportar CSV", () => {
  test.beforeEach(async ({ loginAs }) => loginAs("admin"));

  test("avaliações com os filtros atuais, com o nome do Content-Disposition", async ({ page, api }) => {
    await page.goto("/dashboard/review?status=HIDDEN");
    await expect(page.getByRole("radio", { name: /Ocultas/ })).toBeChecked();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportar CSV" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^avaliacoes-\d{4}-\d{2}-\d{2}\.csv$/);
    await expectToast(page, /CSV de avaliações baixado/);

    const content = await download.createReadStream().then(async (stream) => {
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      return Buffer.concat(chunks).toString("utf8");
    });
    expect(content.charCodeAt(0)).toBe(0xfeff); // BOM para o Excel
    expect(content).toContain(";");
    if (!isRealApi) {
      expect(download.suggestedFilename()).toBe("avaliacoes-2026-10-02.csv");
      expect(content).toContain("Texto copiado de outro site");
      expect(api.callsTo("GET", "/admin/reviews/export.csv")[0].query.get("status")).toBe("HIDDEN");
    }
  });

  test("usuários e atividade", async ({ page }) => {
    await page.goto("/dashboard/users");
    let downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportar CSV" }).click();
    expect((await downloadPromise).suggestedFilename()).toMatch(/^usuarios-.*\.csv$/);

    await page.goto("/dashboard/activity");
    await expect(page.getByRole("heading", { level: 1, name: "Atividade" })).toBeVisible();
    downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportar CSV" }).click();
    expect((await downloadPromise).suggestedFilename()).toMatch(/^atividade-.*\.csv$/);
  });
});
