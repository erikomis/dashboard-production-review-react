import { FileDown } from "lucide-react";
import { Button } from "@/shared/components/button";

type ExportCsvButtonProps = {
  onExport: () => void | Promise<unknown>;
  isExporting: boolean;
  /** Texto do botão (padrão: "Exportar CSV"). */
  label?: string;
  /** Explica o que entra no arquivo (vira descrição acessível). */
  description?: string;
  size?: "default" | "sm";
};

/** Botão de exportação com estado de carregamento (`aria-busy`) e descrição do conteúdo. */
export const ExportCsvButton = ({
  onExport,
  isExporting,
  label = "Exportar CSV",
  description,
  size = "default",
}: ExportCsvButtonProps) => (
  <Button
    color="outline"
    size={size}
    onClick={() => void onExport()}
    isLoading={isExporting}
    title={description}
    aria-description={description}
    leftIcon={<FileDown size={16} aria-hidden="true" />}
  >
    {isExporting ? "Exportando..." : label}
  </Button>
);
