import { dayGroupLabel, formatRelativeTime, groupByDay, lastDaysRange, toDateInput } from "./relative-time";

const NOW = new Date(2026, 9, 2, 12, 0, 0); // 02/10/2026 12:00 local

describe("relative-time", () => {
  it("formata tempo relativo em pt-BR", () => {
    expect(formatRelativeTime(new Date(NOW.getTime() - 10_000).toISOString(), NOW.getTime())).toBe("agora mesmo");
    expect(formatRelativeTime(new Date(NOW.getTime() - 5 * 60_000).toISOString(), NOW.getTime())).toBe("há 5 minutos");
    expect(formatRelativeTime(new Date(NOW.getTime() - 3 * 3600_000).toISOString(), NOW.getTime())).toBe("há 3 horas");
    expect(formatRelativeTime(new Date(NOW.getTime() - 24 * 3600_000).toISOString(), NOW.getTime())).toBe("ontem");
    expect(formatRelativeTime("lixo")).toBe("—");
    expect(formatRelativeTime(null)).toBe("—");
  });

  it("datas para inputs e intervalo dos últimos N dias", () => {
    expect(toDateInput(NOW)).toBe("2026-10-02");
    expect(lastDaysRange(30, NOW)).toEqual({ from: "2026-09-03", to: "2026-10-02" });
    expect(lastDaysRange(1, NOW)).toEqual({ from: "2026-10-02", to: "2026-10-02" });
  });

  it("rótulos e agrupamento por dia", () => {
    const today = new Date(2026, 9, 2, 9).toISOString();
    const yesterday = new Date(2026, 9, 1, 22).toISOString();
    const older = new Date(2026, 8, 28, 8).toISOString();
    expect(dayGroupLabel(today, NOW)).toBe("Hoje");
    expect(dayGroupLabel(yesterday, NOW)).toBe("Ontem");

    const groups = groupByDay(
      [{ at: today }, { at: today }, { at: yesterday }, { at: older }],
      (i) => i.at,
      NOW
    );
    expect(groups.map((g) => [g.label, g.items.length])).toEqual([
      ["Hoje", 2],
      ["Ontem", 1],
      [dayGroupLabel(older, NOW), 1],
    ]);
  });
});
