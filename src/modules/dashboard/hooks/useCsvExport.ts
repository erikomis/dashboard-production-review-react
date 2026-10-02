import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CsvFile } from "@/shared/services/csv-export";
import { saveBlob } from "@/shared/utils/download";
import { getErrorMessage } from "@/shared/utils/error-message";

/**
 * Exporta um CSV da API: baixa o Blob, salva com o nome do `Content-Disposition`
 * e avisa por toast. `exportCsv()` nunca rejeita (o erro vira toast).
 */
/** `noun` no plural e minúsculo: "avaliações", "usuários", "eventos". */
export const useCsvExport = (fetcher: () => Promise<CsvFile>, noun: string) => {
  const mutation = useMutation({ mutationFn: fetcher });
  const exportCsv = async () => {
    try {
      const { blob, filename } = await mutation.mutateAsync();
      saveBlob(blob, filename);
      toast.success(`CSV de ${noun} baixado: ${filename}`);
      return filename;
    } catch (error) {
      toast.error(getErrorMessage(error, `Não foi possível exportar ${noun}.`));
      return null;
    }
  };
  return { exportCsv, isExporting: mutation.isPending };
};
