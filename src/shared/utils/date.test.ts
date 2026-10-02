import { apiTime, parseApiDate } from "./date";
import { formatDate, formatDateTime } from "./format";

describe("datas da API (UTC com Z)", () => {
  it("converte ISO UTC com Z para o fuso do navegador", () => {
    const date = parseApiDate("2026-10-02T02:14:49Z")!;
    expect(date.toISOString()).toBe("2026-10-02T02:14:49.000Z");
    // o texto exibido é o mesmo que o Intl produz no fuso local
    expect(formatDateTime("2026-10-02T02:14:49Z")).toBe(
      new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date)
    );
  });

  it("data/hora sem fuso é tratada como UTC (contrato da API)", () => {
    expect(apiTime("2026-10-02T02:14:49")).toBe(Date.UTC(2026, 9, 2, 2, 14, 49));
    expect(apiTime("2026-10-02T02:14:49.123")).toBe(Date.UTC(2026, 9, 2, 2, 14, 49, 123));
  });

  it("respeita offsets explícitos", () => {
    expect(apiTime("2026-10-01T23:14:49-03:00")).toBe(Date.UTC(2026, 9, 2, 2, 14, 49));
  });

  it("só data é dia do calendário local (não volta um dia no Brasil)", () => {
    const date = parseApiDate("2026-10-02")!;
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 9, 2, 0]);
    expect(formatDate("2026-10-02")).toBe(new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date));
  });

  it("valores inválidos", () => {
    expect(parseApiDate("lixo")).toBeNull();
    expect(parseApiDate(null)).toBeNull();
    expect(Number.isNaN(apiTime(undefined))).toBe(true);
    expect(formatDateTime("")).toBe("—");
  });
});
