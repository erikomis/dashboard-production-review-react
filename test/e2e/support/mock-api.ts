import { Page, Request, Route } from "@playwright/test";
import {
  ACTIVITY,
  ADMIN,
  ADMIN_USERS,
  COMMON_USER,
  CREDENTIALS,
  DEDUPE_RESULT,
  IMPORT_JOB,
  PRODUCTS,
  REPORTS,
  REVIEWS,
  ReviewFixture,
  stats,
  SUGGESTIONS,
  TINY_PNG,
} from "../fixtures/data";

type Json = Record<string, unknown> | unknown[] | null;
export type RecordedCall = { method: string; path: string; query: URLSearchParams; body: unknown };

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const page = <T,>(items: T[], pageNumber: number, size: number) => ({
  content: items.slice(pageNumber * size, pageNumber * size + size),
  page: { size, number: pageNumber, totalElements: items.length, totalPages: Math.ceil(items.length / size) },
});

/**
 * API falsa e com estado, no formato do contrato (`page.route`), para os E2E rodarem sem backend.
 * Guarda as chamadas feitas (`calls`) para os testes conferirem corpo e parâmetros.
 */
export class MockApi {
  user: typeof ADMIN | typeof COMMON_USER | null = null;
  reviews: ReviewFixture[] = clone(REVIEWS);
  reports = clone(REPORTS);
  calls: RecordedCall[] = [];
  /** Força 429 no próximo login (teste do rate limit). */
  rateLimitNextSignIn = 0;

  loginAs(who: "admin" | "user") {
    this.user = who === "admin" ? ADMIN : COMMON_USER;
  }

  callsTo(method: string, path: string | RegExp) {
    return this.calls.filter((c) => c.method === method && (typeof path === "string" ? c.path === path : path.test(c.path)));
  }

  async install(target: Page) {
    await target.route(/\/api\/v1\//, (route, request) => this.handle(route, request));
  }

  private respond(route: Route, request: Request, status: number, body?: Json | string | Buffer, headers: Record<string, string> = {}) {
    const origin = request.headers()["origin"] ?? "http://localhost:5173";
    const isBinary = Buffer.isBuffer(body);
    return route.fulfill({
      status,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-credentials": "true",
        "access-control-expose-headers": "Content-Disposition, Retry-After",
        ...(body !== undefined && !isBinary && typeof body !== "string" ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isBinary || typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  private error(route: Route, request: Request, status: number, message: string) {
    const names: Record<number, string> = { 400: "BAD_REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT_FOUND", 429: "TOO_MANY_REQUESTS" };
    return this.respond(route, request, status, { message, httpStatus: names[status] ?? "ERROR", statusCode: status });
  }

  private csv(route: Route, request: Request, filename: string, header: string, rows: string[]) {
    return this.respond(route, request, 200, "﻿" + [header, ...rows].join("\r\n"), {
      "content-type": "text/csv;charset=UTF-8",
      "content-disposition": `attachment; filename="${filename}"`,
    });
  }

  private filterReviews(query: URLSearchParams) {
    const status = query.get("status");
    const reported = query.get("reported") === "true";
    const note = Number(query.get("note")) || null;
    const productId = Number(query.get("productId")) || null;
    const search = (query.get("search") ?? "").toLowerCase();
    return this.reviews
      .filter((r) => !status || r.status === status)
      .filter((r) => !reported || r.reportsCount > 0)
      .filter((r) => !note || r.note === note)
      .filter((r) => !productId || r.productId === productId)
      .filter((r) => !search || `${r.title} ${r.description}`.toLowerCase().includes(search));
  }

  private moderate(review: ReviewFixture, status: "HIDDEN" | "VISIBLE", reason?: string) {
    review.status = status;
    review.moderatedAt = "2026-10-02T15:00:00Z";
    review.moderatedByName = "Administrador";
    review.moderationReason = status === "HIDDEN" ? (reason ?? null) : null;
    if (status === "HIDDEN") {
      // ocultar resolve as denúncias
      review.reportsCount = 0;
      delete this.reports[review.id];
    }
  }

  private async handle(route: Route, request: Request) {
    const url = new URL(request.url());
    const path = url.pathname.replace(/^.*\/api\/v1/, "");
    const method = request.method();
    const query = url.searchParams;
    let body: unknown = undefined;
    try {
      body = request.postDataJSON();
    } catch {
      body = request.postData();
    }
    // Preflight de CORS (o axios manda Content-Type JSON): responde aqui, sem depender de backend
    if (method === "OPTIONS") {
      const headers = request.headers();
      return route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": headers["origin"] ?? "*",
          "access-control-allow-credentials": "true",
          "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          "access-control-allow-headers": headers["access-control-request-headers"] ?? "content-type",
          "access-control-max-age": "600",
        },
      });
    }
    this.calls.push({ method, path, query, body });
    const json = (status: number, data?: Json) => this.respond(route, request, status, data);
    const m = (re: RegExp) => re.exec(path);
    let match: RegExpExecArray | null;

    // ---------- públicas ----------
    if (path.startsWith("/files/")) return this.respond(route, request, 200, TINY_PNG, { "content-type": "image/png" });
    if (method === "GET" && path === "/notification/sse") return this.respond(route, request, 204);
    if (method === "POST" && path === "/auth/sign-in") {
      if (this.rateLimitNextSignIn > 0) {
        const wait = this.rateLimitNextSignIn;
        this.rateLimitNextSignIn = 0;
        return this.respond(
          route,
          request,
          429,
          { message: `Muitas tentativas. Tente novamente em ${wait} segundos.`, httpStatus: "TOO_MANY_REQUESTS", statusCode: 429 },
          { "retry-after": String(wait) }
        );
      }
      const { username, password } = (body ?? {}) as { username?: string; password?: string };
      if (username === CREDENTIALS.admin.username && password === CREDENTIALS.admin.password) this.user = ADMIN;
      else if (username === CREDENTIALS.user.username && password === CREDENTIALS.user.password) this.user = COMMON_USER;
      else return this.error(route, request, 401, "Usuário ou senha inválidos");
      return this.respond(route, request, 200);
    }
    if (method === "POST" && path === "/auth/logout") {
      this.user = null;
      return this.respond(route, request, 200);
    }
    if (method === "POST" && path === "/auth/refresh-token") return this.user ? this.respond(route, request, 200) : this.error(route, request, 401, "Sessão expirada");
    if (method === "GET" && path === "/production/suggest") {
      const q = (query.get("q") ?? "").trim();
      if (q.length < 2) return this.error(route, request, 400, "q: informe pelo menos 2 caracteres");
      const norm = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
      return json(200, SUGGESTIONS.filter((s) => norm(s.name).includes(norm(q))).slice(0, Number(query.get("limit")) || 8));
    }
    if (method === "GET" && path === "/production/list") {
      const items = query.get("onlyRated") === "true" ? PRODUCTS.filter((p) => p.totalReviews > 0) : PRODUCTS;
      return json(200, page(items, Number(query.get("page") ?? 0), Number(query.get("size") ?? 10)));
    }
    if (method === "GET" && (match = m(/^\/production\/(\d+)$/))) {
      const product = PRODUCTS.find((p) => p.id === Number(match![1]));
      return product ? json(200, { ...product, images: [] }) : this.error(route, request, 404, "Produto não encontrado");
    }
    if (method === "GET" && path === "/category/list")
      return json(200, [
        { id: 1, name: "Eletrônicos", description: "Eletrônicos", slug: "eletronicos", subCategories: [{ id: 1, name: "Celulares", description: "", slug: "celulares", categorieId: 1 }] },
        { id: 2, name: "Casa", description: "Casa", slug: "casa", subCategories: [{ id: 3, name: "Cozinha", description: "", slug: "cozinha", categorieId: 2 }] },
      ]);
    if (method === "GET" && path === "/sub-categorie/list")
      return json(200, [
        { id: 1, name: "Celulares", description: "", slug: "celulares", categorieId: 1 },
        { id: 3, name: "Cozinha", description: "", slug: "cozinha", categorieId: 2 },
      ]);
    if (method === "GET" && path === "/review/list") {
      const visible = this.reviews.filter((r) => r.status === "VISIBLE").map((r) => ({ ...r, reportsCount: 0 }));
      return json(200, page(visible, Number(query.get("page") ?? 0), Number(query.get("size") ?? 10)));
    }

    // ---------- logado ----------
    if (!this.user) return this.error(route, request, 401, "Não autenticado");
    if (method === "GET" && path === "/user/me") return json(200, this.user);
    if (path.startsWith("/admin/") && this.user.id !== ADMIN.id) return this.error(route, request, 403, "Access Denied");

    if (method === "DELETE" && (match = m(/^\/review\/(\d+)\/images\/(\d+)$/))) {
      const review = this.reviews.find((r) => r.id === Number(match![1]));
      if (review) review.images = review.images.filter((i) => i.id !== Number(match![2]));
      return this.respond(route, request, 204);
    }

    // ---------- admin ----------
    if (method === "GET" && path === "/admin/stats") return json(200, stats(Number(query.get("days")) || 30));
    if (method === "GET" && path === "/admin/reviews") {
      return json(200, page(this.filterReviews(query), Number(query.get("page") ?? 0), Number(query.get("size") ?? 10)));
    }
    if (method === "GET" && path === "/admin/reviews/export.csv") {
      const rows = this.filterReviews(query).map((r) => [r.id, r.productName, r.userName, r.note, r.title, r.status].join(";"));
      return this.csv(route, request, "avaliacoes-2026-10-02.csv", "ID;Produto;Autor;Nota;Título;Status", rows);
    }
    if (method === "PATCH" && path === "/admin/reviews/moderation") {
      const { ids, status, reason } = body as { ids: number[]; status: "HIDDEN" | "VISIBLE"; reason?: string };
      const found = this.reviews.filter((r) => ids.includes(r.id));
      found.forEach((r) => this.moderate(r, status, reason));
      return json(200, { updated: found.length });
    }
    if ((match = m(/^\/admin\/reviews\/(\d+)\/(moderation|reports|reply)$/))) {
      const review = this.reviews.find((r) => r.id === Number(match![1]));
      if (!review) return this.error(route, request, 404, "Avaliação não encontrada");
      const action = match[2];
      if (action === "moderation" && method === "PATCH") {
        const { status, reason } = body as { status: "HIDDEN" | "VISIBLE"; reason?: string };
        this.moderate(review, status, reason);
        return json(200, review);
      }
      if (action === "reports" && method === "GET") return json(200, this.reports[review.id] ?? []);
      if (action === "reports" && method === "DELETE") {
        delete this.reports[review.id];
        review.reportsCount = 0;
        return this.respond(route, request, 204);
      }
      if (action === "reply" && method === "PUT") {
        review.reply = { text: (body as { text: string }).text, authorName: "Administrador", repliedAt: "2026-10-02T15:05:00Z" };
        return json(200, review);
      }
      if (action === "reply" && method === "DELETE") {
        review.reply = null;
        return this.respond(route, request, 204);
      }
    }
    if (method === "GET" && path === "/admin/users") return json(200, page(ADMIN_USERS, 0, Number(query.get("size") ?? 10)));
    if (method === "GET" && path === "/admin/users/export.csv")
      return this.csv(route, request, "usuarios-2026-10-02.csv", "ID;Nome;Usuário;E-mail", ADMIN_USERS.map((u) => [u.id, u.name, u.username, u.email].join(";")));
    if (method === "GET" && path === "/admin/activity") return json(200, page(ACTIVITY, 0, Number(query.get("size") ?? 20)));
    if (method === "GET" && path === "/admin/activity/summary")
      return json(200, {
        total: ACTIVITY.length,
        byType: [
          { type: "REVIEW_REPORTED", count: 1 },
          { type: "REVIEW_REPLIED", count: 1 },
          { type: "CATALOG_DEDUPLICATED", count: 1 },
        ],
        byDay: [{ date: "2026-10-02", count: 3 }],
      });
    if (method === "GET" && path === "/admin/activity/export.csv")
      return this.csv(route, request, "atividade-2026-10-02.csv", "Data;Tipo;Mensagem", ACTIVITY.map((a) => [a.occurredAt, a.type, a.message].join(";")));
    if (method === "GET" && path === "/admin/import/jobs/latest") return json(200, IMPORT_JOB);
    if (method === "POST" && path === "/admin/catalog/deduplicate") return json(200, DEDUPE_RESULT);

    console.warn(`[mock-api] rota sem mock: ${method} ${path}`);
    return this.error(route, request, 404, `Rota sem mock: ${method} ${path}`);
  }
}
