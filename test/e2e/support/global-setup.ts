import fs from "node:fs";
import path from "node:path";
import { request } from "@playwright/test";
import { CREDENTIALS } from "../fixtures/data";
import { AUTH_DIR } from "./test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8084/api/v1";
const MAX_AGE_MS = 40 * 60 * 1000;

/**
 * Só com E2E_REAL_API=1: faz login uma vez por perfil e guarda os cookies em `test/.auth/`.
 * A API limita a 5 logins por minuto (usuário + IP), então a sessão é reaproveitada entre execuções.
 */
export default async function globalSetup() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  for (const who of ["admin"] as const) {
    const file = path.join(AUTH_DIR, `${who}.json`);
    if (fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < MAX_AGE_MS) continue;
    const context = await request.newContext();
    const response = await context.post(`${API_URL}/auth/sign-in`, { data: CREDENTIALS[who] });
    if (response.status() === 429) {
      throw new Error(`Rate limit no login (${who}): aguarde ${response.headers()["retry-after"] ?? "alguns"} segundos.`);
    }
    if (!response.ok()) throw new Error(`Login ${who} falhou: ${response.status()} ${await response.text()}`);
    await context.storageState({ path: file });
    await context.dispose();
  }
}
