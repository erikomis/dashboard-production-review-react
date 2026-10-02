import { ImportJob } from "@/shared/types/admin";
import {
  elapsedSeconds,
  estimateRemainingSeconds,
  formatDuration,
  getImportStatusMeta,
  importProgressPercent,
  importSummaryText,
  isImportRunning,
} from "./import-progress";

const job = (overrides: Partial<ImportJob> = {}): ImportJob => ({
  id: "1",
  source: "OPEN_FOOD_FACTS",
  status: "RUNNING",
  totalSteps: 12,
  completedSteps: 3,
  currentStep: "Bebidas › Cafés",
  categoriesCreated: 1,
  subCategoriesCreated: 3,
  productsCreated: 30,
  productsSkipped: 4,
  imagesCreated: 30,
  errors: [],
  startedAt: "2026-10-02T03:10:00Z",
  finishedAt: null,
  startedBy: "Administrador",
  ...overrides,
});

describe("import-progress", () => {
  it("calcula o percentual arredondado", () => {
    expect(importProgressPercent(job())).toBe(25);
    expect(importProgressPercent(job({ completedSteps: 1 }))).toBe(8);
    expect(importProgressPercent(job({ completedSteps: 12 }))).toBe(100);
  });

  it("é seguro com total zero, valores fora da faixa e job ausente", () => {
    expect(importProgressPercent(job({ totalSteps: 0 }))).toBe(0);
    expect(importProgressPercent(job({ completedSteps: 20 }))).toBe(100);
    expect(importProgressPercent(job({ completedSteps: -1 }))).toBe(0);
    expect(importProgressPercent(null)).toBe(0);
  });

  it("concluída é sempre 100%, mesmo com passos com erro", () => {
    expect(importProgressPercent(job({ status: "COMPLETED", completedSteps: 11 }))).toBe(100);
  });

  it("estado e rótulo", () => {
    expect(isImportRunning(job())).toBe(true);
    expect(isImportRunning(job({ status: "FAILED" }))).toBe(false);
    expect(getImportStatusMeta("COMPLETED")).toEqual({ label: "Concluída", color: "success" });
    expect(getImportStatusMeta("FAILED").color).toBe("danger");
  });

  it("estima o tempo restante com 6,5 s por passo", () => {
    expect(estimateRemainingSeconds(job())).toBe(59); // 9 × 6,5 = 58,5
    expect(estimateRemainingSeconds(job({ status: "COMPLETED" }))).toBeNull();
  });

  it("formata durações", () => {
    expect(formatDuration(45)).toBe("45 s");
    expect(formatDuration(80)).toBe("1 min 20 s");
    expect(formatDuration(120)).toBe("2 min");
  });

  it("tempo decorrido usa o fim ou o relógio atual", () => {
    expect(elapsedSeconds("2026-10-02T03:10:00Z", "2026-10-02T03:11:20Z")).toBe(80);
    expect(elapsedSeconds("2026-10-02T03:10:00Z", null, Date.parse("2026-10-02T03:10:30Z"))).toBe(30);
    expect(elapsedSeconds(null)).toBe(0);
  });

  it("resume o resultado com plural correto", () => {
    expect(importSummaryText(job({ productsCreated: 1, productsSkipped: 0, categoriesCreated: 0, subCategoriesCreated: 0 })))
      .toBe("1 produto criado, 0 ignorados, 0 categorias novas, 0 subcategorias novas");
    expect(importSummaryText(job({ errors: ["x"] }))).toContain("1 erro");
  });
});
