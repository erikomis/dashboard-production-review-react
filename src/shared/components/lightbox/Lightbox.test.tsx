import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lightbox, LightboxImage } from "./Lightbox";

const IMAGES: LightboxImage[] = [
  { id: 1, src: "/a.jpg", alt: "Foto 1 da avaliação" },
  { id: 2, src: "/b.jpg", alt: "Foto 2 da avaliação" },
  { id: 3, src: "/c.jpg", alt: "Foto 3 da avaliação" },
];

const Harness = ({ onClose = vi.fn(), onRemove }: { onClose?: () => void; onRemove?: (image: LightboxImage) => void }) => {
  const [index, setIndex] = useState(0);
  return (
    <Lightbox
      isOpen
      images={IMAGES}
      index={index}
      onIndexChange={setIndex}
      onClose={onClose}
      title="Fotos da avaliação “Ok”"
      onRemove={onRemove}
    />
  );
};

describe("Lightbox (visualizador de fotos)", () => {
  it("é um diálogo modal nomeado, com a posição anunciada e foco no fechar", () => {
    render(<Harness />);
    const dialog = screen.getByRole("dialog", { name: "Fotos da avaliação “Ok”" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Foto 1 de 3")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Foto 1 da avaliação" })).toHaveAttribute("src", "/a.jpg");
    expect(screen.getByRole("button", { name: "Fechar visualizador" })).toHaveFocus();
  });

  it("troca de foto com as setas do teclado e com os botões (circular)", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Foto 2 de 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Próxima foto" }));
    expect(screen.getByText("Foto 3 de 3")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Foto 1 de 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Foto anterior" }));
    expect(screen.getByRole("img", { name: "Foto 3 da avaliação" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ver foto 2" }));
    expect(screen.getByRole("button", { name: "Ver foto 2" })).toHaveAttribute("aria-current", "true");
  });

  it("Esc fecha", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("admin remove a foto atual", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Harness onRemove={onRemove} />);
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Remover foto" }));
    expect(onRemove).toHaveBeenCalledWith(IMAGES[1]);
  });

  it("sem `onRemove` não mostra a remoção; fechado não renderiza nada", () => {
    const { rerender } = render(<Harness />);
    expect(screen.queryByRole("button", { name: "Remover foto" })).not.toBeInTheDocument();
    rerender(
      <Lightbox isOpen={false} images={IMAGES} index={0} onIndexChange={vi.fn()} onClose={vi.fn()} title="x" />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
