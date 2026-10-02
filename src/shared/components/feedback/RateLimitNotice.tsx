import { useState } from "react";
import { Timer } from "lucide-react";
import { formatWait } from "@/shared/utils/error-message";

/**
 * Aviso de rate limit com a contagem regressiva do `Retry-After`.
 * O leitor de tela ouve o tempo uma vez (o número que muda a cada segundo fica oculto dele).
 */
export const RateLimitNotice = ({ secondsLeft }: { secondsLeft: number }) => {
  const [announced, setAnnounced] = useState(secondsLeft);
  if (secondsLeft > announced) setAnnounced(secondsLeft);
  if (secondsLeft <= 0) return null;
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-black dark:text-bodydark1"
    >
      <Timer size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-warning-dark dark:text-warning" />
      <p>
        <strong className="font-semibold">Muitas tentativas.</strong> Por segurança, aguarde{" "}
        <span aria-hidden="true" className="tabular-nums">
          {formatWait(secondsLeft)}
        </span>
        <span className="sr-only">{formatWait(announced)}</span> para tentar de novo.
      </p>
    </div>
  );
};
