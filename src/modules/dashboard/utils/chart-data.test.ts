import {
  barWidth,
  chartTheme,
  formatDayShort,
  formatNote,
  niceMax,
  niceTicks,
  parsePeriod,
  peakDay,
  sumCounts,
  tickInterval,
  toRatingBuckets,
  weightedAverage,
} from "./chart-data";

describe("chart-data", () => {
  it("distribuição de notas: ordem 5→1, percentuais e chaves ausentes", () => {
    const buckets = toRatingBuckets({ "1": 0, "2": 0, "3": 1, "5": 2 });
    expect(buckets.map((b) => b.note)).toEqual([5, 4, 3, 2, 1]);
    expect(buckets[0]).toEqual({ note: 5, count: 2, percent: 67 });
    expect(buckets[1]).toEqual({ note: 4, count: 0, percent: 0 });
    expect(toRatingBuckets(undefined).every((b) => b.percent === 0)).toBe(true);
  });

  it("soma, pico e média ponderada das séries diárias", () => {
    const series = [
      { date: "2026-10-01", count: 3, averageNote: 4 },
      { date: "2026-10-02", count: 0, averageNote: null },
      { date: "2026-10-03", count: 1, averageNote: 2 },
    ];
    expect(sumCounts(series)).toBe(4);
    expect(peakDay(series)?.date).toBe("2026-10-01");
    expect(peakDay([{ date: "x", count: 0 }])).toBeNull();
    expect(weightedAverage(series)).toBe(3.5);
    expect(weightedAverage([])).toBeNull();
  });

  it("formatação de nota e dia", () => {
    expect(formatNote(4.25)).toBe("4,3");
    expect(formatNote(null)).toBe("—");
    expect(formatDayShort("2026-10-02")).toBe("02/10");
  });

  it("período aceita só 7, 30 e 90", () => {
    expect(parsePeriod("7")).toBe(7);
    expect(parsePeriod("90")).toBe(90);
    expect(parsePeriod("15")).toBe(30);
    expect(parsePeriod(null)).toBe(30);
  });

  it("escala e rótulos do eixo", () => {
    expect(niceTicks(0)).toEqual([0, 1, 2, 3, 4]);
    expect(niceTicks(3)).toEqual([0, 1, 2, 3, 4]);
    expect(niceTicks(7)).toEqual([0, 2, 4, 6, 8]);
    expect(niceTicks(27)).toEqual([0, 10, 20, 30]);
    expect(niceMax(17)).toBe(20);
    expect(niceMax(130)).toBe(150);
    expect(tickInterval(7)).toBe(0);
    expect(tickInterval(30)).toBe(4);
    expect(tickInterval(90)).toBe(12);
  });

  it("largura das barras de ranking", () => {
    expect(barWidth(5, 10)).toBe(50);
    expect(barWidth(0, 10)).toBe(0);
    expect(barWidth(1, 1000)).toBe(2); // mínimo visível
    expect(barWidth(3, 0)).toBe(0);
  });

  it("tema de cores muda no modo escuro e mantém a estrela", () => {
    expect(chartTheme("light").primary).toBe("#3C50E0");
    expect(chartTheme("dark").primary).not.toBe(chartTheme("light").primary);
    expect(chartTheme("dark").star).toBe("#D97706");
  });
});
