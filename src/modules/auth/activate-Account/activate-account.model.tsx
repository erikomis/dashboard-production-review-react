import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ActivateAccountService } from "../services/activateAccount";

type ActivateAccountServiceProps = typeof ActivateAccountService;

/**
 * GET /auth/activate/{token}. Usa React Query para deduplicar a chamada: com
 * useEffect, o StrictMode chamava duas vezes e a 2ª (token já usado) dava 404,
 * mostrando erro mesmo com a conta ativada.
 */
export const useActivateAccountModel = (service: ActivateAccountServiceProps) => {
  const { token } = useParams();

  const { isPending, isSuccess, error } = useQuery({
    queryKey: ["activate-account", token],
    queryFn: () => service(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const status: "loading" | "success" | "error" = !token
    ? "error"
    : isPending
      ? "loading"
      : isSuccess
        ? "success"
        : "error";

  const message =
    status === "success"
      ? "Conta ativada com sucesso! Você já pode entrar."
      : status === "error"
        ? !token
          ? "Link de ativação inválido."
          : `${error?.message || "Não foi possível ativar a conta."} O link pode ter expirado ou já ter sido usado.`
        : "Ativando sua conta...";

  return { status, message };
};
