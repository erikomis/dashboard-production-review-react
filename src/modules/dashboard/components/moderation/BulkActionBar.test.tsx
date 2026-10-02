import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BulkActionBar } from "./BulkActionBar";

const handlers = () => ({ onHide: vi.fn(), onRestore: vi.fn(), onClear: vi.fn() });

describe("BulkActionBar (moderação em lote)", () => {
  it("não aparece sem seleção", () => {
    const { container } = render(<BulkActionBar count={0} hideCount={0} restoreCount={0} {...handlers()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("mostra quantas estão selecionadas numa região nomeada e chama as ações", async () => {
    const user = userEvent.setup();
    const h = handlers();
    render(<BulkActionBar count={3} hideCount={3} restoreCount={0} {...h} />);

    const region = screen.getByRole("region", { name: "Ações em lote" });
    expect(region).toHaveTextContent("3 avaliações selecionadas");

    await user.click(screen.getByRole("button", { name: "Ocultar selecionadas" }));
    expect(h.onHide).toHaveBeenCalledTimes(1);

    // nenhuma oculta entre as selecionadas: restaurar não se aplica
    expect(screen.getByRole("button", { name: "Restaurar selecionadas" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Limpar seleção" }));
    expect(h.onClear).toHaveBeenCalledTimes(1);
  });

  it("indica quantas serão afetadas quando a seleção é mista", async () => {
    const user = userEvent.setup();
    const h = handlers();
    render(<BulkActionBar count={5} hideCount={3} restoreCount={2} {...h} />);
    expect(screen.getByRole("button", { name: "Ocultar selecionadas (3)" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Restaurar selecionadas (2)" }));
    expect(h.onRestore).toHaveBeenCalledTimes(1);
  });

  it("singular e bloqueio enquanto a moderação roda", () => {
    render(<BulkActionBar count={1} hideCount={1} restoreCount={0} isBusy {...handlers()} />);
    expect(screen.getByText("avaliação selecionada", { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ocultar selecionadas" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Limpar seleção" })).toBeDisabled();
  });
});
