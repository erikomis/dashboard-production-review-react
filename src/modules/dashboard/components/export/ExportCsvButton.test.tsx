import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { renderWithProviders } from "@/shared/test/render";
import { useCsvExport } from "@/modules/dashboard/hooks/useCsvExport";
import { CsvFile } from "@/shared/services/csv-export";
import { ExportCsvButton } from "./ExportCsvButton";

vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const Harness = ({ fetcher }: { fetcher: () => Promise<CsvFile> }) => {
  const { exportCsv, isExporting } = useCsvExport(fetcher, "avaliações");
  return <ExportCsvButton onExport={exportCsv} isExporting={isExporting} description="Avaliações com os filtros atuais" />;
};

describe("ExportCsvButton + useCsvExport (exportação CSV)", () => {
  const createObjectURL = vi.fn(() => "blob:csv");
  const revokeObjectURL = vi.fn();
  let clicked: HTMLAnchorElement[] = [];

  beforeEach(() => {
    clicked = [];
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push(this);
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("mostra o carregamento e baixa o arquivo com o nome do Content-Disposition", async () => {
    const user = userEvent.setup();
    let resolve!: (file: CsvFile) => void;
    const fetcher = vi.fn(() => new Promise<CsvFile>((r) => (resolve = r)));
    renderWithProviders(<Harness fetcher={fetcher} />);

    const button = screen.getByRole("button", { name: "Exportar CSV" });
    expect(button).toHaveAccessibleDescription("Avaliações com os filtros atuais");
    await user.click(button);

    const busy = await screen.findByRole("button", { name: "Exportando..." });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute("aria-busy", "true");

    resolve({ blob: new Blob(["﻿ID;Produto"], { type: "text/csv" }), filename: "avaliacoes-2026-10-02.csv" });
    await waitFor(() => expect(clicked).toHaveLength(1));
    expect(clicked[0].download).toBe("avaliacoes-2026-10-02.csv");
    expect(clicked[0].href).toBe("blob:csv");
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("CSV de avaliações baixado: avaliacoes-2026-10-02.csv");
    expect(await screen.findByRole("button", { name: "Exportar CSV" })).toBeEnabled();
  });

  it("erro vira toast e o botão volta ao normal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness fetcher={() => Promise.reject(new Error("Sem permissão"))} />);
    await user.click(screen.getByRole("button", { name: "Exportar CSV" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Sem permissão"));
    expect(clicked).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Exportar CSV" })).toBeEnabled();
  });
});
