import { SLUG_PATTERN, slugify } from "./slugify";

describe("slugify", () => {
  it("remove acentos, usa minúsculas e hífens", () => {
    expect(slugify("Eletrônicos e Informática")).toBe("eletronicos-e-informatica");
    expect(slugify("  Notebook   Pro 14  ")).toBe("notebook-pro-14");
    expect(slugify("Café & Chá!")).toBe("cafe-cha");
    expect(slugify("--Já--")).toBe("ja");
  });

  it("gera slugs válidos para o padrão aceito", () => {
    expect(SLUG_PATTERN.test(slugify("Smartphone X"))).toBe(true);
    expect(SLUG_PATTERN.test("Com Espaço")).toBe(false);
    expect(SLUG_PATTERN.test("fim-")).toBe(false);
  });
});
