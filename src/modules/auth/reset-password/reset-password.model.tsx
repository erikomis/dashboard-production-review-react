import { useForm } from "react-hook-form";
import { ResetPasswordService } from "../services/reset-password";
import { ResetPassword } from "./reset-password.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaResetPassword } from "./reset-password.schema";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getErrorMessage } from "@/shared/utils/error-message";
import { useRateLimit } from "@/shared/hooks/useRateLimit";
import { toast } from "react-toastify";

type ResetPasswordService = typeof ResetPasswordService;

export const useResetPasswordModel = (service: ResetPasswordService) => {
  const [errosResponse, setErrorsResponse] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ResetPassword>({
    resolver: zodResolver(SchemaResetPassword),
    defaultValues: { email: searchParams.get("email") ?? "" },
  });

  const rateLimit = useRateLimit();
  const onSubmit = async ({ email, password, recoveryCode }: ResetPassword) => {
    setErrorsResponse("");
    try {
      await service(email, password, recoveryCode);
      toast.success("Senha alterada! Entre com a nova senha.");
      navigate("/", { replace: true });
    } catch (er) {
      // 400 código inválido
      rateLimit.register(er);
      setErrorsResponse(getErrorMessage(er, "Não foi possível alterar a senha."));
    }
  };
  return {
    errosResponse,
    register,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
    waitSeconds: rateLimit.secondsLeft,
  };
};
