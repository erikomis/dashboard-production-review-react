import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/shared/test/render";
import { ProductsService } from "@/modules/dashboard/services/products.service";
import { CommandPaletteProvider, useCommandPalette } from "./CommandPaletteProvider";

vi.mock("@/modules/dashboard/services/products.service", () => ({
  ProductsService: { suggest: vi.fn() },
}));

const suggest = vi.mocked(ProductsService.suggest);

const OpenButton = () => {
  const { open } = useCommandPalette();
  return (
    <button type="button" onClick={open}>
      Abrir busca
    </button>
  );
};

const setup = () => {
  const user = userEvent.setup();
  renderWithProviders(
    <CommandPaletteProvider>
      <OpenButton />
    </CommandPaletteProvider>
  );
  return user;
};

describe("CommandPalette (busca rápida)", () => {
  beforeEach(() => {
    suggest.mockReset();
    suggest.mockResolvedValue([
      { id: 37, name: "Café Em Cápsula Illy", slug: "cafe-illy", imageUrl: null, categoryName: "Bebidas" },
      { id: 3, name: "Cafeteira Express", slug: "cafeteira-express", imageUrl: null, categoryName: "Casa" },
    ]);
  });

  it("abre com Ctrl+K como combobox ARIA com foco no campo e fecha com Esc", async () => {
    const user = setup();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    const dialog = await screen.findByRole("dialog", { name: "Busca rápida" });
    const input = within(dialog).getByRole("combobox", { name: /Buscar telas, ações e produtos/ });
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls", within(dialog).getByRole("listbox").id);
    expect(within(dialog).getByRole("group", { name: "Ir para" })).toBeInTheDocument();
    // atalhos de teclado visíveis
    expect(within(dialog).getByText("navegar")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("também abre com ⌘+K e pelo botão do header", async () => {
    const user = setup();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Abrir busca" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("filtra telas sem acento, navega com as setas e abre com Enter", async () => {
    const user = setup();
    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox");
    await user.type(input, "usuarios");

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveTextContent("Usuários");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);

    await user.clear(input);
    await user.type(input, "aval");
    const reviewOptions = screen.getAllByRole("option");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", reviewOptions[1].id);
    await user.keyboard("{ArrowUp}{Enter}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard/review");
  });

  it("busca produtos só a partir de 2 caracteres, com debounce", async () => {
    const user = setup();
    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox");

    await user.type(input, "c");
    expect(screen.getByText(/Digite 2 letras ou mais/)).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(suggest).not.toHaveBeenCalled();

    await user.type(input, "af");
    const product = await screen.findByRole("option", { name: /Café Em Cápsula Illy/ });
    expect(suggest).toHaveBeenCalledTimes(1);
    expect(suggest).toHaveBeenCalledWith("caf", 6);
    expect(screen.getByRole("group", { name: "Produtos" })).toBeInTheDocument();

    await user.click(product);
    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard/products/37");
  });

  it("mantém o foco preso dentro da busca", async () => {
    const user = setup();
    await user.keyboard("{Control>}k{/Control}");
    const dialog = await screen.findByRole("dialog");
    for (let i = 0; i < 4; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });
});
