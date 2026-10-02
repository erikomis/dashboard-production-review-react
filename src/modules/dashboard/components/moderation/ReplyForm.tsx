import { MessageSquareReply, Pencil, Send, Trash2 } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Button } from "@/shared/components/button";
import { Label } from "@/shared/components/label";
import { Textarea } from "@/shared/components/textarea";
import { ReviewReply } from "@/shared/types/review";
import { formatDateTime } from "@/shared/utils/format";
import { formatRelativeTime } from "@/modules/dashboard/utils/relative-time";
import { cn } from "@/shared/utils/utils";

export const REPLY_MAX = 1000;

type ReplyFormProps = {
  /** Resposta publicada (ou `null`). */
  reply?: ReviewReply | null;
  /** Mostrando o formulário (nova resposta ou edição). */
  isEditing: boolean;
  field: UseFormRegisterReturn<"text">;
  error?: string;
  length: number;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  onEdit: () => void;
  onCancel: () => void;
  onRemove: () => void;
  isSaving?: boolean;
  isRemoving?: boolean;
  /** id do textarea (único na página). */
  inputId?: string;
};

/** Resposta oficial da equipe: mostra a publicada ou o formulário com contador de caracteres. */
export const ReplyForm = ({
  reply,
  isEditing,
  field,
  error,
  length,
  onSubmit,
  onEdit,
  onCancel,
  onRemove,
  isSaving = false,
  isRemoving = false,
  inputId = "official-reply",
}: ReplyFormProps) => {
  if (reply && !isEditing) {
    return (
      <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-4 dark:border-primary-light/30 dark:bg-primary/10">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary dark:text-primary-light">
          <MessageSquareReply size={14} aria-hidden="true" />
          Resposta da equipe ReviewStore
        </p>
        <p className="mt-2 whitespace-pre-line break-words text-sm text-black dark:text-bodydark1">{reply.text}</p>
        <p className="mt-2 text-xs text-body dark:text-bodydark">
          {reply.authorName ?? "Equipe"} ·{" "}
          <time dateTime={reply.repliedAt} title={formatDateTime(reply.repliedAt)}>
            {formatRelativeTime(reply.repliedAt)}
          </time>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" color="outline" onClick={onEdit} leftIcon={<Pencil size={14} aria-hidden="true" />}>
            Editar resposta
          </Button>
          <Button
            size="sm"
            color="ghost"
            onClick={onRemove}
            isLoading={isRemoving}
            className="text-danger hover:bg-danger/10 dark:text-danger-light dark:hover:bg-danger/20"
            leftIcon={<Trash2 size={14} aria-hidden="true" />}
          >
            {isRemoving ? "Removendo..." : "Remover"}
          </Button>
        </div>
      </div>
    );
  }

  const near = length > REPLY_MAX * 0.9;
  return (
    <form onSubmit={onSubmit} noValidate aria-label={reply ? "Editar resposta oficial" : "Escrever resposta oficial"}>
      <Textarea
        id={inputId}
        rows={4}
        maxLength={REPLY_MAX}
        placeholder="Agradeça, esclareça dúvidas ou explique o que foi feito. A resposta aparece no site abaixo da avaliação."
        error={error}
        hint={
          <span className={cn("tabular-nums", near && "font-medium text-warning-dark dark:text-warning")}>
            {length}/{REPLY_MAX} caracteres
          </span>
        }
        aria-required="true"
        disabled={isSaving}
        {...field}
      >
        <Label htmlFor={inputId} value={reply ? "Editar resposta" : "Resposta oficial"} required />
      </Textarea>
      <div className="-mt-1 flex flex-wrap justify-end gap-2">
        {reply && (
          <Button type="button" size="sm" color="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
        )}
        <Button type="submit" size="sm" isLoading={isSaving} leftIcon={<Send size={14} aria-hidden="true" />}>
          {isSaving ? "Publicando..." : reply ? "Salvar resposta" : "Publicar resposta"}
        </Button>
      </div>
    </form>
  );
};
