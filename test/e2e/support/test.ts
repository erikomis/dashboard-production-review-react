import fs from "node:fs";
import path from "node:path";
import { test as base, expect, Page } from "@playwright/test";
import { MockApi } from "./mock-api";

/** `E2E_REAL_API=1`: usa a API real (sessão salva no global-setup) em vez dos mocks. */
export const isRealApi = !!process.env.E2E_REAL_API;
export const AUTH_DIR = path.resolve(process.cwd(), "test/.auth");

type Who = "admin" | "user";

type Fixtures = {
  /** API falsa (só no modo mockado). */
  api: MockApi;
  /** Entra como admin/usuário sem passar pela tela de login. */
  loginAs: (who: Who) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  // Nenhum teste pode terminar com erro de JavaScript na página
  page: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use(page);
    expect(errors, "erros de JavaScript na página").toEqual([]);
  },
  // `auto`: instalado em todo teste, mesmo nos que não usam `api` (nada vaza para a API real)
  api: [
    async ({ page }, use) => {
      const api = new MockApi();
      if (!isRealApi) await api.install(page);
      await use(api);
    },
    { auto: true },
  ],
  loginAs: async ({ api, context }, use) => {
    await use(async (who) => {
      if (!isRealApi) {
        api.loginAs(who);
        return;
      }
      const file = path.join(AUTH_DIR, `${who}.json`);
      if (!fs.existsSync(file)) throw new Error(`Sessão ${who} não encontrada: rode com E2E_REAL_API=1 (global-setup).`);
      const state = JSON.parse(fs.readFileSync(file, "utf8"));
      await context.addCookies(state.cookies);
    });
  },
});

/** Marca testes que alteram dados: só rodam com a API mockada. */
export const mockedOnly = () => test.skip(isRealApi, "Altera dados: roda só com a API mockada");

/** Espera o toast com o texto e fecha todos. */
export const expectToast = async (page: Page, text: string | RegExp) => {
  await expect(page.locator(".Toastify__toast").filter({ hasText: text }).first()).toBeVisible();
};

export { expect };
