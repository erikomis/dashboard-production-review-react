import { environment } from "@/environment/environment";

/**
 * As fotos das avaliações vêm com URL relativa à API (`/api/v1/files/...`).
 * Prefixa com a origem da API (`VITE_API_URL` sem o `/api/v1`); URLs absolutas passam direto.
 */
export const resolveMediaUrl = (url?: string | null, apiUrl: string = environment.apiUrl ?? "") => {
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) return url;
  let origin = "";
  try {
    origin = new URL(apiUrl).origin;
  } catch {
    origin = "";
  }
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};
