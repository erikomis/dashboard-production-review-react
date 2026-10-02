import { EyeOff } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Modal } from "@/shared/components/Modal/modal";
import { Button } from "@/shared/components/button";
import { Label } from "@/shared/components/label";
import { Textarea } from "@/shared/components/textarea";

type HideReviewModalProps = {
  isOpen: boolean;
  reviewTitle?: string;
  reasonField: UseFormRegisterReturn<"reason">;
  reasonError?: string;
  reasonLength: number;
  isLoading: boolean;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

const MAX = 255;

/** Ocultar exige um motivo: ele aparece para o autor em "Minhas avaliações". */
export const HideReviewModal = ({
  isOpen,
  reviewTitle,
  reasonField,
  reasonError,
  reasonLength,
  isLoading,
  onSubmit,
  onClose,
}: HideReviewModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={isLoading ? () => undefined : onClose}
    title="Ocultar avaliação"
    description={
      <>
        <p>
          A avaliação <strong className="text-black dark:text-white">“{reviewTitle}”</strong> deixa de aparecer no
          site e sai das notas médias. Você pode restaurá-la depois.
        </p>
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
        hint={`${reasonLength}/${MAX} caracteres. O autor verá este motivo.`}
        aria-required="true"
        data-autofocus
        disabled={isLoading}
        {...reasonField}
      >
        <Label htmlFor="moderation-reason" value="Motivo" required />
      </Textarea>
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" color="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} leftIcon={<EyeOff size={16} aria-hidden="true" />}>
          {isLoading ? "Ocultando..." : "Ocultar avaliação"}
        </Button>
      </div>
    </form>
  </Modal>
);
