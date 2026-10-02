/**
 * Nome do arquivo em `Content-Disposition` (`filename*=` RFC 5987 ou `filename=`).
 * `null` se o header não existir ou não tiver nome.
 */
export const filenameFromContentDisposition = (header?: string | null): string | null => {
  if (!header) return null;
  const star = /filename\*\s*=\s*(?:UTF-8|utf-8)?''([^;]+)/i.exec(header);
  if (star) {
    try {
      return decodeURIComponent(star[1].trim().replace(/^"|"$/g, ""));
    } catch {
      // segue para o filename simples
    }
  }
  const plain = /filename\s*=\s*("([^"]*)"|[^;]+)/i.exec(header);
  const name = plain ? (plain[2] ?? plain[1]).trim() : "";
  return name || null;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Nome padrão quando o header não chega ao navegador: `avaliacoes-2026-10-02.csv`. */
export const fallbackCsvName = (prefix: string, now: Date = new Date()) =>
  `${prefix}-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;

/** Dispara o download de um Blob no navegador. */
export const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // dá tempo ao navegador de iniciar o download antes de liberar a URL
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
