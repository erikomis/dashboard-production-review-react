import { useEffect, useState } from "react";
import { getRetryAfterSeconds } from "@/shared/utils/error-message";

/**
 * Contagem regressiva depois de um 429 (rate limit da API).
 * `register(error)` devolve `true` se o erro era um 429 e inicia a contagem.
 */
export const useRateLimit = () => {
  const [until, setUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until === null) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) setUntil(null);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [until]);

  const secondsLeft = until === null ? 0 : Math.max(0, Math.ceil((until - now) / 1000));

  const register = (error: unknown) => {
    const seconds = getRetryAfterSeconds(error);
    if (seconds === null) return false;
    const current = Date.now();
    setNow(current);
    setUntil(current + seconds * 1000);
    return true;
  };

  return { secondsLeft, isLimited: secondsLeft > 0, register };
};
