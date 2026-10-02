import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { replySchema } from "@/modules/dashboard/view/review-list/review-list.schema";
import { ReplyValues } from "@/modules/dashboard/view/review-list/review-list.type";
import { ReviewReply } from "@/shared/types/review";
import { REPLY_MAX, ReplyForm } from "./ReplyForm";

type HarnessProps = {
  reply?: ReviewReply | null;
  editing?: boolean;
  onValid?: (values: ReplyValues) => void;
  onRemove?: () => void;
  onEdit?: () => void;
};

const Harness = ({ reply = null, editing = true, onValid = vi.fn(), onRemove = vi.fn(), onEdit = vi.fn() }: HarnessProps) => {
  const form = useForm<ReplyValues>({ resolver: zodResolver(replySchema), defaultValues: { text: reply?.text ?? "" } });
  const text = useWatch({ control: form.control, name: "text" });
  return (
    <ReplyForm
      reply={reply}
      isEditing={editing}
      field={form.register("text")}
      error={form.formState.errors.text?.message}
      length={text?.length ?? 0}
      onSubmit={form.handleSubmit(onValid)}
      onEdit={onEdit}
      onCancel={vi.fn()}
      onRemove={onRemove}
    />
  );
};

const REPLY: ReviewReply = {
  text: "Obrigado pelo retorno! Repassamos ao fabricante.",
  authorName: "Administrador",
  repliedAt: "2026-10-02T14:12:27Z",
};

describe("ReplyForm (resposta oficial)", () => {
  it("valida o texto vazio e limita a 1000 caracteres", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<Harness onValid={onValid} />);
    const field = screen.getByRole("textbox", { name: /Resposta oficial/ });
    expect(field).toHaveAttribute("maxLength", String(REPLY_MAX));

    await user.click(screen.getByRole("button", { name: "Publicar resposta" }));
    expect(await screen.findByText("Escreva a resposta antes de publicar")).toBeInTheDocument();
    expect(onValid).not.toHaveBeenCalled();
  });

  it("mostra o contador e publica o texto", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<Harness onValid={onValid} />);
    await user.type(screen.getByRole("textbox", { name: /Resposta oficial/ }), "Obrigado!");
    expect(screen.getByText("9/1000 caracteres")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Publicar resposta" }));
    await waitFor(() => expect(onValid).toHaveBeenCalledWith({ text: "Obrigado!" }, expect.anything()));
  });

  it("a resposta publicada aparece com autor, editar e remover", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onEdit = vi.fn();
    render(<Harness reply={REPLY} editing={false} onRemove={onRemove} onEdit={onEdit} />);
    expect(screen.getByText("Resposta da equipe ReviewStore")).toBeInTheDocument();
    expect(screen.getByText(REPLY.text)).toBeInTheDocument();
    expect(screen.getByText(/Administrador/)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Editar resposta" }));
    expect(onEdit).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Remover" }));
    expect(onRemove).toHaveBeenCalled();
  });

  it("na edição, o formulário vem preenchido e o botão salva", () => {
    render(<Harness reply={REPLY} editing />);
    expect(screen.getByRole("textbox", { name: /Editar resposta/ })).toHaveValue(REPLY.text);
    expect(screen.getByRole("button", { name: "Salvar resposta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });
});
