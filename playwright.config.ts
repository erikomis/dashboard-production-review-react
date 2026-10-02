import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do painel.
 * - Padrão: API mockada com `page.route` (fixtures em `test/e2e/fixtures`), roda em qualquer lugar.
 * - `E2E_REAL_API=1`: contra a API real (`VITE_API_URL`), reaproveitando a sessão do global-setup;
 *   os testes que alteram dados são pulados.
 * Localmente usa o Chrome instalado (`channel: "chrome"`) e o `npm run dev`; no CI, o Chromium do
 * Playwright e o build de produção servido pelo `vite preview` (rode `npm run build` antes).
 */
const isCI = !!process.env.CI;
const isRealApi = !!process.env.E2E_REAL_API;
const PORT = Number(process.env.E2E_PORT ?? 5173);
const baseURL = `http://localhost:${PORT}`;
const channel = process.env.E2E_CHANNEL ?? (isCI ? undefined : "chrome");

export default defineConfig({
  testDir: "./test/e2e",
  testMatch: /.*\.e2e-spec\.ts$/,
  fullyParallel: !isRealApi,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // contra a API real, um teste por vez (rate limit e dados compartilhados)
  workers: isRealApi ? 1 : isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  globalSetup: isRealApi ? "./test/e2e/support/global-setup.ts" : undefined,
  use: {
    baseURL,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], ...(channel ? { channel } : {}) },
    },
  ],
  webServer: {
    command: isCI ? `npx vite preview --port ${PORT} --strictPort` : `npm run dev -- --port ${PORT} --strictPort`,
    url: baseURL,
    // localmente reaproveita o `npm run dev` que já estiver rodando
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: { VITE_API_URL: process.env.VITE_API_URL ?? "http://localhost:8084/api/v1" },
  },
});
