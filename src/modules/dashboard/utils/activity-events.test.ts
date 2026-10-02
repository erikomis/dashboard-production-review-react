import {
  EVENT_TYPE_GROUPS,
  EVENT_TYPES,
  getEntityLabel,
  getEntityLink,
  getEventMeta,
  humanizeConstant,
} from "./activity-events";

describe("activity-events", () => {
  it("formata tipos conhecidos com rótulo, ícone e tom", () => {
    expect(getEventMeta("REVIEW_HIDDEN")).toEqual({ label: "Avaliação ocultada", icon: "eye-off", tone: "warning" });
    expect(getEventMeta("PRODUCT_DELETED").tone).toBe("danger");
    expect(getEventMeta("CATALOG_IMPORT_COMPLETED")).toMatchObject({ icon: "download", tone: "success" });
  });

  it("tipos desconhecidos viram texto legível e tom neutro", () => {
    expect(getEventMeta("SOMETHING_NEW")).toEqual({ label: "Something new", icon: "activity", tone: "neutral" });
    expect(getEventMeta(undefined).label).toBe("Evento");
    expect(humanizeConstant("USER_LOGGED_IN")).toBe("User logged in");
  });

  it("cobre todos os tipos do contrato e agrupa cada um uma única vez", () => {
    const contract = [
      "USER_SIGNED_UP", "USER_ACTIVATED", "USER_LOGGED_IN", "USER_ROLE_CHANGED", "USER_STATUS_CHANGED",
      "CATEGORY_CREATED", "CATEGORY_UPDATED", "CATEGORY_DELETED",
      "SUBCATEGORY_CREATED", "SUBCATEGORY_UPDATED", "SUBCATEGORY_DELETED",
      "PRODUCT_CREATED", "PRODUCT_UPDATED", "PRODUCT_DELETED", "PRODUCT_IMAGE_ADDED", "PRODUCT_IMAGE_REMOVED",
      "REVIEW_CREATED", "REVIEW_UPDATED", "REVIEW_DELETED", "REVIEW_HIDDEN", "REVIEW_RESTORED",
      "CATALOG_IMPORT_STARTED", "CATALOG_IMPORT_COMPLETED", "CATALOG_IMPORT_FAILED",
      // fase 3
      "REVIEW_REPORTED", "REVIEW_REPORTS_DISMISSED", "REVIEW_REPLIED", "REVIEW_REPLY_DELETED",
      "REVIEW_IMAGE_ADDED", "REVIEW_IMAGE_REMOVED", "PRODUCT_FOLLOWED", "PRODUCT_UNFOLLOWED",
      "CATALOG_DEDUPLICATED", "REVIEWS_BULK_MODERATED",
    ];
    for (const type of contract) {
      expect(EVENT_TYPES).toContain(type);
      expect(getEventMeta(type).icon).not.toBe("activity");
    }
    const grouped = EVENT_TYPE_GROUPS.flatMap((g) => g.types);
    expect(grouped.sort()).toEqual([...EVENT_TYPES].sort());
  });

  it("rótulo de entidade", () => {
    expect(getEntityLabel("SUBCATEGORY")).toBe("Subcategoria");
    expect(getEntityLabel(null)).toBe("—");
  });

  it("monta links só quando a entidade ainda existe", () => {
    expect(getEntityLink("PRODUCT", "12", "PRODUCT_UPDATED")).toBe("/dashboard/products/12");
    expect(getEntityLink("CATEGORY", "3")).toBe("/dashboard/categories/3");
    expect(getEntityLink("SUBCATEGORY", "4")).toBe("/dashboard/sub-categories/4");
    expect(getEntityLink("REVIEW", "9", "REVIEW_HIDDEN")).toBe("/dashboard/review/9");
    expect(getEntityLink("IMPORT", "uuid-1", "CATALOG_IMPORT_STARTED")).toBe("/dashboard/import");
    expect(getEntityLink("PRODUCT", "12", "PRODUCT_DELETED")).toBeNull();
    expect(getEntityLink("USER", "2")).toBeNull();
    expect(getEntityLink("PRODUCT", "abc")).toBeNull();
    expect(getEntityLink("PRODUCT", null)).toBeNull();
  });

  it("eventos da fase 3 têm rótulo, cor e destino próprios", () => {
    expect(getEventMeta("REVIEW_REPORTED")).toEqual({ label: "Avaliação denunciada", icon: "flag", tone: "danger" });
    expect(getEventMeta("REVIEW_REPLIED").icon).toBe("reply");
    expect(getEventMeta("CATALOG_DEDUPLICATED").icon).toBe("merge");
    expect(getEntityLink("PRODUCT", null, "CATALOG_DEDUPLICATED")).toBe("/dashboard/import");
    expect(getEntityLink("REVIEW", null, "REVIEWS_BULK_MODERATED")).toBe("/dashboard/review");
    expect(getEntityLink("REVIEW", "4", "REVIEW_REPORTED")).toBe("/dashboard/review?status=REPORTED");
    expect(getEntityLink("REVIEW", "4", "REVIEW_REPLIED")).toBe("/dashboard/review/4");
  });
});
