import { navGroups } from "@/modules/dashboard/components/Sidebar/nav-items";
import { ACTION_COMMANDS, filterCommands, normalizeText, PAGE_COMMANDS, shortcutLabel } from "./command-items";

describe("command-items", () => {
  it("normaliza acentos, maiúsculas e espaços", () => {
    expect(normalizeText("  Avaliações   Denunciadas ")).toBe("avaliacoes denunciadas");
  });

  it("filtra sem acento, por palavra-chave e com o prefixo primeiro", () => {
    const all = [...PAGE_COMMANDS, ...ACTION_COMMANDS];
    expect(filterCommands(all, "").length).toBe(all.length);
    expect(filterCommands(all, "avaliacoes")[0].label).toBe("Avaliações");
    expect(filterCommands(all, "auditoria").map((i) => i.label)).toEqual(["Atividade"]);
    expect(filterCommands(all, "denunc").map((i) => i.id)).toContain("action-reported");
    expect(filterCommands(all, "nova cat").map((i) => i.label)).toEqual(["Nova categoria", "Nova subcategoria"]);
    expect(filterCommands(all, "xyz")).toEqual([]);
  });

  it("todas as telas do menu estão na busca rápida", () => {
    const routes = PAGE_COMMANDS.map((i) => i.to);
    for (const item of navGroups.flatMap((g) => g.items)) expect(routes).toContain(item.route);
  });

  it("mostra o atalho certo para cada sistema", () => {
    expect(shortcutLabel("MacIntel")).toBe("⌘ K");
    expect(shortcutLabel("Win32")).toBe("Ctrl K");
  });
});
