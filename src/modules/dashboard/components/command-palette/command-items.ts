/**
 * Itens fixos da busca rápida (telas e ações) e o filtro por texto.
 * Lógica pura: a view escolhe o ícone a partir de `icon`.
 */

export type CommandIcon =
  | "home"
  | "package"
  | "tags"
  | "folder"
  | "download"
  | "message"
  | "users"
  | "history"
  | "settings"
  | "user"
  | "plus"
  | "flag"
  | "eye-off"
  | "moon"
  | "search";

export type CommandItem = {
  id: string;
  label: string;
  /** Texto secundário (ex.: grupo do menu). */
  hint?: string;
  icon: CommandIcon;
  /** Rota do painel ou ação especial. */
  to?: string;
  action?: "toggle-theme";
  /** Palavras extras para a busca (sinônimos). */
  keywords?: string[];
};

export type CommandGroup = { id: string; label: string; items: CommandItem[] };

export const PAGE_COMMANDS: CommandItem[] = [
  { id: "page-home", label: "Visão geral", hint: "Geral", icon: "home", to: "/dashboard/home", keywords: ["inicio", "dashboard", "graficos", "pendencias"] },
  { id: "page-products", label: "Produtos", hint: "Catálogo", icon: "package", to: "/dashboard/products", keywords: ["catalogo"] },
  { id: "page-categories", label: "Categorias", hint: "Catálogo", icon: "tags", to: "/dashboard/categories" },
  { id: "page-subcategories", label: "Subcategorias", hint: "Catálogo", icon: "folder", to: "/dashboard/sub-categories" },
  { id: "page-import", label: "Importar catálogo", hint: "Catálogo", icon: "download", to: "/dashboard/import", keywords: ["open food facts", "duplicados", "deduplicar"] },
  { id: "page-reviews", label: "Avaliações", hint: "Comunidade", icon: "message", to: "/dashboard/review", keywords: ["reviews", "moderacao", "comentarios"] },
  { id: "page-users", label: "Usuários", hint: "Comunidade", icon: "users", to: "/dashboard/users", keywords: ["contas", "admin"] },
  { id: "page-activity", label: "Atividade", hint: "Sistema", icon: "history", to: "/dashboard/activity", keywords: ["auditoria", "logs", "eventos"] },
  { id: "page-settings", label: "Configurações", hint: "Sistema", icon: "settings", to: "/dashboard/settings", keywords: ["preferencias"] },
  { id: "page-profile", label: "Meu perfil", hint: "Sistema", icon: "user", to: "/dashboard/profile", keywords: ["conta"] },
];

export const ACTION_COMMANDS: CommandItem[] = [
  { id: "action-reported", label: "Avaliações denunciadas", hint: "Moderação", icon: "flag", to: "/dashboard/review?status=REPORTED", keywords: ["denuncias", "reports"] },
  { id: "action-hidden", label: "Avaliações ocultas", hint: "Moderação", icon: "eye-off", to: "/dashboard/review?status=HIDDEN", keywords: ["moderacao"] },
  { id: "action-new-review", label: "Nova avaliação", hint: "Criar", icon: "plus", to: "/dashboard/review/add" },
  { id: "action-new-product", label: "Novo produto", hint: "Criar", icon: "plus", to: "/dashboard/products/add" },
  { id: "action-new-category", label: "Nova categoria", hint: "Criar", icon: "plus", to: "/dashboard/categories/add" },
  { id: "action-new-subcategory", label: "Nova subcategoria", hint: "Criar", icon: "plus", to: "/dashboard/sub-categories/add" },
  { id: "action-theme", label: "Alternar tema claro/escuro", hint: "Aparência", icon: "moon", action: "toggle-theme", keywords: ["modo escuro", "dark"] },
];

/** Minúsculas, sem acentos e com espaços colapsados ("Avaliações" → "avaliacoes"). */
export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/**
 * Filtra por todas as palavras digitadas (em qualquer ordem) no rótulo, na dica ou nas palavras-chave.
 * Itens cujo rótulo começa com a busca vêm primeiro.
 */
export const filterCommands = (items: CommandItem[], query: string) => {
  const q = normalizeText(query);
  if (!q) return items;
  const words = q.split(" ");
  return items
    .map((item) => {
      const label = normalizeText(item.label);
      const haystack = normalizeText([item.label, item.hint ?? "", ...(item.keywords ?? [])].join(" "));
      if (!words.every((word) => haystack.includes(word))) return null;
      const score = label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2;
      return { item, score };
    })
    .filter((entry): entry is { item: CommandItem; score: number } => entry !== null)
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.item);
};

/** Rótulo do atalho conforme o sistema: "⌘ K" no Mac, "Ctrl K" nos demais. */
export const shortcutLabel = (platform: string = typeof navigator !== "undefined" ? navigator.platform : "") =>
  /mac|iphone|ipad/i.test(platform) ? "⌘ K" : "Ctrl K";
