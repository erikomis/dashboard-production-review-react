/** Gera um slug: minúsculas, sem acento, palavras separadas por hífen. */
export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
