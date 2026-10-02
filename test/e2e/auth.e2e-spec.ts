import { CREDENTIALS } from "./fixtures/data";
import { expect, isRealApi, mockedOnly, test } from "./support/test";

test.describe("Login e acesso", () => {
  test("admin entra e cai na visão geral com as pendências", async ({ page, api }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Entrar no painel" })).toBeVisible();
    await page.getByLabel(/Usuário ou e-mail/).fill(CREDENTIALS.admin.username);
    await page.getByLabel(/^Senha/).fill(CREDENTIALS.admin.password);
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.waitForURL("**/dashboard/home");
    await expect(page.getByRole("heading", { level: 1, name: "Visão geral" })).toBeVisible();
    const pending = page.getByRole("region", { name: "Pendências" });
    await expect(pending).toBeVisible();
    if (!isRealApi) {
      await expect(page.getByText("144", { exact: true })).toBeVisible();
      await expect(pending.getByText("2 avaliações denunciadas esperam revisão.")).toBeVisible();
      await expect(pending.getByRole("link", { name: /Promoção imperdível/ })).toBeVisible();
      expect(api.callsTo("POST", "/auth/sign-in")[0].body).toEqual(CREDENTIALS.admin);
    }
  });

  test("usuário sem perfil ADMIN vê “acesso restrito”", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel(/Usuário ou e-mail/).fill(CREDENTIALS.user.username);
    await page.getByLabel(/^Senha/).fill(CREDENTIALS.user.password);
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByRole("heading", { name: "Acesso restrito" })).toBeVisible();
    await expect(page.getByText(/Este painel é exclusivo para administradores/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sair e entrar com outra conta" })).toBeVisible();
  });

  test("429 no login mostra a espera do Retry-After e bloqueia o botão", async ({ page, api }) => {
    mockedOnly();
    api.rateLimitNextSignIn = 42;
    await page.goto("/");
    await page.getByLabel(/Usuário ou e-mail/).fill("admin");
    await page.getByLabel(/^Senha/).fill("errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Por segurança, aguarde" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Aguarde \d+ s/ })).toBeDisabled();
    await expect(page.locator(".Toastify__toast").filter({ hasText: "Tente novamente em 42 segundos" })).toBeVisible();
  });
});
