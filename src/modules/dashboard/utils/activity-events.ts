/**
 * Apresentação dos eventos de auditoria (`type` / `entityType`).
 * Lógica pura: a view escolhe o ícone a partir de `icon` e as classes a partir de `tone`.
 */

export type EventTone = "primary" | "success" | "danger" | "warning" | "info" | "neutral";

export type EventIcon =
  | "user"
  | "user-plus"
  | "log-in"
  | "shield"
  | "user-toggle"
  | "tag"
  | "folder"
  | "package"
  | "image"
  | "message"
  | "eye-off"
  | "eye"
  | "download"
  | "activity"
  | "flag"
  | "flag-off"
  | "reply"
  | "reply-off"
  | "image-plus"
  | "image-minus"
  | "bell-plus"
  | "bell-minus"
  | "merge"
  | "layers";

export type EventMeta = { label: string; icon: EventIcon; tone: EventTone };

const EVENT_META: Record<string, EventMeta> = {
  USER_SIGNED_UP: { label: "Cadastro de usuário", icon: "user-plus", tone: "primary" },
  USER_ACTIVATED: { label: "Conta ativada", icon: "user", tone: "success" },
  USER_LOGGED_IN: { label: "Login", icon: "log-in", tone: "neutral" },
  USER_ROLE_CHANGED: { label: "Perfil alterado", icon: "shield", tone: "warning" },
  USER_STATUS_CHANGED: { label: "Status de usuário", icon: "user-toggle", tone: "warning" },
  CATEGORY_CREATED: { label: "Categoria criada", icon: "tag", tone: "success" },
  CATEGORY_UPDATED: { label: "Categoria editada", icon: "tag", tone: "info" },
  CATEGORY_DELETED: { label: "Categoria excluída", icon: "tag", tone: "danger" },
  SUBCATEGORY_CREATED: { label: "Subcategoria criada", icon: "folder", tone: "success" },
  SUBCATEGORY_UPDATED: { label: "Subcategoria editada", icon: "folder", tone: "info" },
  SUBCATEGORY_DELETED: { label: "Subcategoria excluída", icon: "folder", tone: "danger" },
  PRODUCT_CREATED: { label: "Produto criado", icon: "package", tone: "success" },
  PRODUCT_UPDATED: { label: "Produto editado", icon: "package", tone: "info" },
  PRODUCT_DELETED: { label: "Produto excluído", icon: "package", tone: "danger" },
  PRODUCT_IMAGE_ADDED: { label: "Imagem adicionada", icon: "image", tone: "success" },
  PRODUCT_IMAGE_REMOVED: { label: "Imagem removida", icon: "image", tone: "danger" },
  REVIEW_CREATED: { label: "Avaliação criada", icon: "message", tone: "primary" },
  REVIEW_UPDATED: { label: "Avaliação editada", icon: "message", tone: "info" },
  REVIEW_DELETED: { label: "Avaliação excluída", icon: "message", tone: "danger" },
  REVIEW_HIDDEN: { label: "Avaliação ocultada", icon: "eye-off", tone: "warning" },
  REVIEW_RESTORED: { label: "Avaliação restaurada", icon: "eye", tone: "success" },
  REVIEW_REPORTED: { label: "Avaliação denunciada", icon: "flag", tone: "danger" },
  REVIEW_REPORTS_DISMISSED: { label: "Denúncias descartadas", icon: "flag-off", tone: "neutral" },
  REVIEW_REPLIED: { label: "Resposta oficial", icon: "reply", tone: "primary" },
  REVIEW_REPLY_DELETED: { label: "Resposta removida", icon: "reply-off", tone: "danger" },
  REVIEW_IMAGE_ADDED: { label: "Foto na avaliação", icon: "image-plus", tone: "success" },
  REVIEW_IMAGE_REMOVED: { label: "Foto removida", icon: "image-minus", tone: "danger" },
  REVIEWS_BULK_MODERATED: { label: "Moderação em lote", icon: "layers", tone: "warning" },
  PRODUCT_FOLLOWED: { label: "Produto seguido", icon: "bell-plus", tone: "info" },
  PRODUCT_UNFOLLOWED: { label: "Deixou de seguir", icon: "bell-minus", tone: "neutral" },
  CATALOG_IMPORT_STARTED: { label: "Importação iniciada", icon: "download", tone: "info" },
  CATALOG_IMPORT_COMPLETED: { label: "Importação concluída", icon: "download", tone: "success" },
  CATALOG_IMPORT_FAILED: { label: "Importação falhou", icon: "download", tone: "danger" },
  CATALOG_DEDUPLICATED: { label: "Duplicados removidos", icon: "merge", tone: "info" },
  LEGACY: { label: "Evento legado", icon: "activity", tone: "neutral" },
};

/** Todos os tipos conhecidos, na ordem do contrato (para o filtro). */
export const EVENT_TYPES = Object.keys(EVENT_META);

/** "SOME_NEW_TYPE" → "Some new type" (tipos que o painel ainda não conhece). */
export const humanizeConstant = (value: string) => {
  const text = value.toLowerCase().replace(/_/g, " ").trim();
  return text ? text[0].toUpperCase() + text.slice(1) : "";
};

export const getEventMeta = (type?: string | null): EventMeta => {
  if (type && EVENT_META[type]) return EVENT_META[type];
  return {
    label: type ? humanizeConstant(type) : "Evento",
    icon: "activity",
    tone: "neutral",
  };
};

export const ENTITY_LABELS: Record<string, string> = {
  USER: "Usuário",
  CATEGORY: "Categoria",
  SUBCATEGORY: "Subcategoria",
  PRODUCT: "Produto",
  PRODUCT_IMAGE: "Imagem de produto",
  REVIEW: "Avaliação",
  IMPORT: "Importação",
};

export const ENTITY_TYPES = Object.keys(ENTITY_LABELS);

export const getEntityLabel = (entityType?: string | null) =>
  entityType ? (ENTITY_LABELS[entityType] ?? humanizeConstant(entityType)) : "—";

/** Tipos agrupados por entidade, para o `<optgroup>` do filtro. */
export const EVENT_TYPE_GROUPS: { label: string; types: string[] }[] = [
  { label: "Usuários", types: EVENT_TYPES.filter((t) => t.startsWith("USER_")) },
  {
    label: "Catálogo",
    types: EVENT_TYPES.filter((t) => /^(CATEGORY|SUBCATEGORY|PRODUCT)_/.test(t)),
  },
  { label: "Avaliações", types: EVENT_TYPES.filter((t) => t.startsWith("REVIEW_") || t === "REVIEWS_BULK_MODERATED") },
  { label: "Importação e catálogo", types: EVENT_TYPES.filter((t) => t.startsWith("CATALOG_")) },
  { label: "Outros", types: ["LEGACY"] },
];

/**
 * Rota do painel para a entidade do evento, quando faz sentido abrir algo.
 * Eventos de exclusão não têm link: a entidade não existe mais.
 */
export const getEntityLink = (
  entityType?: string | null,
  entityId?: string | null,
  type?: string | null
): string | null => {
  if (type?.endsWith("_DELETED")) return null;
  if (entityType === "IMPORT" || type === "CATALOG_DEDUPLICATED") return "/dashboard/import";
  if (type === "REVIEWS_BULK_MODERATED") return "/dashboard/review";
  if (type === "REVIEW_REPORTED" && entityId && /^\d+$/.test(entityId)) return "/dashboard/review?status=REPORTED";
  if (!entityId || !/^\d+$/.test(entityId)) return null;
  switch (entityType) {
    case "PRODUCT":
      return `/dashboard/products/${entityId}`;
    case "CATEGORY":
      return `/dashboard/categories/${entityId}`;
    case "SUBCATEGORY":
      return `/dashboard/sub-categories/${entityId}`;
    case "REVIEW":
      return `/dashboard/review/${entityId}`;
    default:
      return null;
  }
};
