import { useNavigate } from "react-router-dom";
import { ForgotPasswordService } from "../services/forgot-password";
import { useForm } from "react-hook-form";
import { SchemaForgotPassword } from "./forgot-password.schema";
import { toast } from "react-toastify";
import { ForgotPassword } from "./forgot-password.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/shared/utils/error-message";
import { useRateLimit } from "@/shared/hooks/useRateLimit";

type ForgotPasswordServiceProps = typeof ForgotPasswordService;

export const useForgotPasswordModel = (service: ForgotPasswordServiceProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPassword>({
    resolver: zodResolver(SchemaForgotPassword),
  });

  const rateLimit = useRateLimit();
  const onSubmit = async (data: ForgotPassword) => {
    try {
      await service(data.email);
      toast.success("Enviamos um código de 6 dígitos para o seu e-mail.");
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (er) {
      // 404 e-mail não cadastrado
      rateLimit.register(er);
      toast.error(getErrorMessage(er, "Não foi possível enviar o código."));
    }
  };

  return {
    handleSubmit,
    register,
    errors,
    onSubmit,
    isSubmitting,
    waitSeconds: rateLimit.secondsLeft,
  };
};
