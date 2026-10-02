import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hideReviewSchema } from "@/modules/dashboard/view/review-list/review-list.schema";
import { HideReviewValues } from "@/modules/dashboard/view/review-list/review-list.type";
import { HideReviewModal } from "./HideReviewModal";

/** Mesmo encaixe do view-model: react-hook-form + zod. */
const Harness = ({ onValid, onClose = vi.fn(), count }: { onValid: (v: HideReviewValues) => void; onClose?: () => void; count?: number }) => {
  const form = useForm<HideReviewValues>({ resolver: zodResolver(hideReviewSchema), defaultValues: { reason: "" } });
  const reason = useWatch({ control: form.control, name: "reason" });
  return (
    <HideReviewModal
      isOpen
      reviewTitle="Ok"
      count={count}
      reasonField={form.register("reason")}
      reasonError={form.formState.errors.reason?.message}
      reasonLength={reason?.length ?? 0}
      isLoading={false}
      onSubmit={form.handleSubmit(onValid)}
      onClose={onClose}
      onPickReason={(text) => form.setValue("reason", text, { shouldValidate: true })}
    />
  );
};

describe("HideReviewModal (modal de motivo)", () => {
  it("exige o motivo e mostra o erro ligado ao campo", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<Harness onValid={onValid} />);

    const dialog = screen.getByRole("dialog", { name: "Ocultar avaliação" });
    expect(dialog).toHaveTextContent("“Ok”");
    const field = screen.getByRole("textbox", { name: /Motivo/ });
    expect(field).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Ocultar avaliação" }));
    expect(await screen.findByText("Explique o motivo com pelo menos 3 caracteres")).toBeInTheDocument();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(onValid).not.toHaveBeenCalled();
  });

  it("conta os caracteres e envia o motivo digitado", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<Harness onValid={onValid} />);
    await user.type(screen.getByRole("textbox", { name: /Motivo/ }), "Spam com link");
    expect(screen.getByText(/13\/255 caracteres/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ocultar avaliação" }));
    await waitFor(() => expect(onValid).toHaveBeenCalledWith({ reason: "Spam com link" }, expect.anything()));
  });

  it("motivos rápidos preenchem o campo", async () => {
    const user = userEvent.setup();
    render(<Harness onValid={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Linguagem ofensiva" }));
    expect(screen.getByRole("textbox", { name: /Motivo/ })).toHaveValue("Linguagem ofensiva");
  });

  it("em lote, o título e o botão dizem quantas serão ocultadas; Esc fecha", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onValid={vi.fn()} onClose={onClose} count={3} />);
    expect(screen.getByRole("dialog", { name: "Ocultar 3 avaliações" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ocultar 3 avaliações" })).toBeInTheDocument();
    expect(screen.getByText(/Os autores verão este motivo/)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
