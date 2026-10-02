import { EyeOff } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Modal } from "@/shared/components/Modal/modal";
import { Button } from "@/shared/components/button";
import { Label } from "@/shared/components/label";
import { Textarea } from "@/shared/components/textarea";
import { QUICK_HIDE_REASONS } from "@/modules/dashboard/utils/review-reports";

type HideReviewModalProps = {
  isOpen: boolean;
  /** Uma avaliação: o título dela. */
  reviewTitle?: string;
  /** Moderação em lote: quantas avaliações serão ocultadas. */
  count?: number;
  reasonField: UseFormRegisterReturn<"reason">;
  reasonError?: string;
  reasonLength: number;
  isLoading: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  /** Preenche o motivo com um texto pronto (chips de motivo rápido). */
  onPickReason?: (reason: string) => void;
  /** Nota extra (ex.: "As 2 denúncias serão resolvidas."). */
  note?: React.ReactNode;
};

const MAX = 255;

/** Ocultar exige um motivo: ele aparece para o autor em "Minhas avaliações". */
export const HideReviewModal = ({
  isOpen,
  reviewTitle,
  count,
  reasonField,
  reasonError,
  reasonLength,
  isLoading,
  onSubmit,
  onClose,
  onPickReason,
  note,
}: HideReviewModalProps) => {
  const isBulk = count !== undefined;
  const plural = (count ?? 1) !== 1;
  const submitLabel = isBulk ? `Ocultar ${count} ${plural ? "avaliações" : "avaliação"}` : "Ocultar avaliação";
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      title={isBulk ? `Ocultar ${plural ? `${count} avaliações` : "1 avaliação"}` : "Ocultar avaliação"}
      size="lg"
      description={
        <>
          {isBulk ? (
            <p>
              {plural ? "As avaliações selecionadas deixam" : "A avaliação selecionada deixa"} de aparecer no site e
              {plural ? " saem" : " sai"} das notas médias. O mesmo motivo vale para todas e pode ser desfeito depois.
            </p>
          ) : (
            <p>
              A avaliação <strong className="text-black dark:text-white">“{reviewTitle}”</strong> deixa de aparecer no
              site e sai das notas médias. Você pode restaurá-la depois.
            </p>
          )}
          {note && <p className="mt-1">{note}</p>}
        </>
      }
      icon={
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning-dark dark:bg-warning/20 dark:text-warning">
          <EyeOff size={22} aria-hidden="true" />
        </span>
      }
    >
      <form onSubmit={onSubmit} noValidate className="mt-2">
        <Textarea
          id="moderation-reason"
          rows={3}
          maxLength={MAX}
          placeholder="Ex.: linguagem ofensiva, spam, conteúdo fora do tema..."
          error={reasonError}
          hint={`${reasonLength}/${MAX} caracteres. ${isBulk && plural ? "Os autores verão" : "O autor verá"} este motivo.`}
          aria-required="true"
          data-autofocus
          disabled={isLoading}
          {...reasonField}
        >
          <Label htmlFor="moderation-reason" value="Motivo" required />
        </Textarea>
        {onPickReason && (
          <div className="-mt-2 mb-4">
            <p id="quick-reasons-label" className="mb-1.5 text-xs text-body dark:text-bodydark">
              Motivos rápidos
            </p>
            <ul aria-labelledby="quick-reasons-label" className="flex flex-wrap gap-1.5">
              {QUICK_HIDE_REASONS.map((reason) => (
                <li key={reason}>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onPickReason(reason)}
                    className="rounded-full border border-stroke px-2.5 py-1 text-xs text-black transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-strokedark dark:text-bodydark1 dark:hover:border-primary-light dark:hover:text-primary-light"
                  >
                    {reason}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" color="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading} leftIcon={<EyeOff size={16} aria-hidden="true" />}>
            {isLoading ? "Ocultando..." : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
