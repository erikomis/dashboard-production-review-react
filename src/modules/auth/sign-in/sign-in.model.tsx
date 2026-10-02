import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutationUser } from "../hooks/useMutationUser";
import { SchemaSignIn } from "./sign-in.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInValues } from "./sign-in.type";
import { SignInService } from "../services/sign-in";
import { toast } from "react-toastify";
import { queryClient } from "@/shared/libs/react-query";
import { meQueryOptions } from "@/shared/hooks/useMeQuery";
import { getApiMessage, getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { useRateLimit } from "@/shared/hooks/useRateLimit";

type SignInServiceProps = typeof SignInService;
export const useSignInModel = (SignInService: SignInServiceProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SchemaSignIn),
  });
  const { mutateAsync: signIN, error, isPending } = useMutationUser({
    service: SignInService,
  });
  const rateLimit = useRateLimit();
  const onSubmit: SubmitHandler<SignInValues> = async (data) => {
    if (rateLimit.isLimited) return;
    try {
      await signIN(data);
    } catch (er) {
      // 401 credenciais inválidas; 403 conta não ativada (o e-mail é reenviado);
      // 429 rate limit (5 tentativas por minuto): mostra a contagem regressiva
      rateLimit.register(er);
      toast.error(
        getErrorStatus(er) === 401
          ? (getApiMessage(er) ?? "Usuário ou senha inválidos.")
          : getErrorMessage(er, "Não foi possível entrar. Tente novamente.")
      );
      return;
    }
    // Atualiza o cache de "me" antes de entrar: um 401 anterior em cache faria o
    // ProtectedRouter mandar o usuário de volta para o login.
    await queryClient.fetchQuery({ ...meQueryOptions, staleTime: 0 }).catch(() => undefined);
    navigate("/dashboard/home", { replace: true });
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    error,
    isPending,
    waitSeconds: rateLimit.secondsLeft,
  };
};
