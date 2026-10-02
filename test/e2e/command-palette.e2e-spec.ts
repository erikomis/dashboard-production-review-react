import { expect, isRealApi, test } from "./support/test";

test.describe("Busca rápida (Ctrl+K)", () => {
  test.beforeEach(async ({ loginAs }) => loginAs("admin"));

  test("abre com Ctrl+K, navega entre telas e busca produtos", async ({ page, api }) => {
    await page.goto("/dashboard/home");
    await expect(page.getByRole("heading", { level: 1, name: "Visão geral" })).toBeVisible();

    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Busca rápida" });
    const input = dialog.getByRole("combobox");
    await expect(input).toBeFocused();
    await expect(dialog.getByText("abre de qualquer tela")).toBeVisible();

    await input.fill("usuarios");
    const first = dialog.getByRole("option").first();
    await expect(first).toContainText("Usuários");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/dashboard\/users$/);
    await expect(dialog).toBeHidden();

    // produtos via /production/suggest (2+ caracteres)
    await page.keyboard.press("Control+k");
    await input.fill("caf");
    const product = dialog.getByRole("option", { name: /Cafeteira Express/ });
    await expect(product).toBeVisible();
    if (!isRealApi) expect(api.callsTo("GET", "/production/suggest").every((c) => (c.query.get("q") ?? "").length >= 2)).toBe(true);

    // espera a busca assentar e desce com as setas até o produto
    await expect(dialog.getByText("Buscando...")).toHaveCount(0);
    const productId = (await product.getAttribute("id"))!;
    await expect(async () => {
      if ((await input.getAttribute("aria-activedescendant")) !== productId) await page.keyboard.press("ArrowDown");
      await expect(input).toHaveAttribute("aria-activedescendant", productId, { timeout: 200 });
    }).toPass({ timeout: 5_000 });
    await expect(product).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/dashboard\/products\/3$/);
  });

  test("botão do header abre, Esc fecha e o foco volta", async ({ page }) => {
    await page.goto("/dashboard/review");
    const trigger = page.getByRole("button", { name: /Busca rápida/ });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Busca rápida" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(dialog.locator(":focus")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
