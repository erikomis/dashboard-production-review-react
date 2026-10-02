import { isAxiosError } from "axios";
import { api } from "./api";
import { fallbackCsvName, filenameFromContentDisposition } from "@/shared/utils/download";

export type CsvFile = { blob: Blob; filename: string };

const cleanParams = (params: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

/**
 * Baixa um CSV da API como Blob e descobre o nome pelo `Content-Disposition`.
 * Se o header não estiver exposto via CORS, usa `{prefixo}-AAAA-MM-DD.csv` (mesmo padrão da API).
 */
export const fetchCsv = async (url: string, params: Record<string, unknown>, fallbackPrefix: string): Promise<CsvFile> => {
  let response;
  try {
    response = await api.request<Blob>({
      method: "GET",
      url,
      params: cleanParams(params),
      responseType: "blob",
      headers: { Accept: "text/csv" },
    });
  } catch (error) {
    // Com responseType "blob" o corpo de erro também vem como Blob: converte para JSON
    // para que `getErrorMessage` mostre a mensagem da API.
    const data = isAxiosError(error) ? error.response?.data : undefined;
    if (isAxiosError(error) && error.response && data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await data.text());
      } catch {
        error.response.data = undefined;
      }
    }
    throw error;
  }
  const header = response.headers?.["content-disposition"] as string | undefined;
  return {
    blob: response.data,
    filename: filenameFromContentDisposition(header) ?? fallbackCsvName(fallbackPrefix),
  };
};
