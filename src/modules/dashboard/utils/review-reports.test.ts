import { getReportReasonMeta, groupReportReasons, reportsLabel, suggestedHideReason } from "./review-reports";

describe("review-reports", () => {
  it("rótulos dos motivos, com fallback para desconhecidos", () => {
    expect(getReportReasonMeta("SPAM").label).toBe("Spam");
    expect(getReportReasonMeta("FALSE_INFORMATION").label).toBe("Informação falsa");
    expect(getReportReasonMeta("NOVO_MOTIVO").label).toBe("Outro motivo");
    expect(reportsLabel(1)).toBe("1 denúncia");
    expect(reportsLabel(3)).toBe("3 denúncias");
  });

  it("agrupa motivos do mais frequente para o menos frequente", () => {
    const grouped = groupReportReasons([{ reason: "OFFENSIVE" }, { reason: "SPAM" }, { reason: "SPAM" }]);
    expect(grouped).toEqual([
      { reason: "SPAM", count: 2, label: "Spam" },
      { reason: "OFFENSIVE", count: 1, label: "Ofensiva" },
    ]);
  });

  it("sugere um motivo de ocultação a partir das denúncias", () => {
    expect(suggestedHideReason([{ reason: "SPAM" }, { reason: "SPAM" }])).toBe("Ocultada após 2 denúncias (spam).");
    expect(suggestedHideReason([{ reason: "OTHER" }])).toBe("Ocultada após 1 denúncia (denúncias da comunidade).");
    expect(suggestedHideReason([])).toBe("");
  });
});
