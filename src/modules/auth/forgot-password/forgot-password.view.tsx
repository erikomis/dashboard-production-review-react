import { Link } from "react-router-dom";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Mail } from "lucide-react";
import { Label } from "@/shared/components/label";
import { useForgotPasswordModel } from "./forgot-password.model";
import { AuthHeading } from "../AuthHeading";

type ForgotPasswordProps = ReturnType<typeof useForgotPasswordModel>;
export const ForgotPasswordView = (props: ForgotPasswordProps) => {
  const { errors, handleSubmit, onSubmit, register, isSubmitting } = props;

  return (
    <div className="w-full p-6 sm:p-12.5 xl:p-17.5">
      <AuthHeading
        title="Esqueci minha senha"
        subtitle="Informe o e-mail da conta. Enviaremos um código de 6 dígitos para redefinir a senha."
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting || undefined}>
        <Input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          icon={<Mail size={20} />}
          error={errors.email?.message}
        >
          <Label value="E-mail" htmlFor="email" required />
        </Input>
        <Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar código"}
        </Button>
        <p className="mt-6 text-center text-body dark:text-bodydark">
          Já tem o código?{" "}
          <Link to="/reset-password" className="rounded font-medium text-primary hover:underline dark:text-primary-light">
            Redefinir senha
          </Link>
          {" · "}
          <Link to="/" className="rounded font-medium text-primary hover:underline dark:text-primary-light">
            Voltar ao login
          </Link>
        </p>
      </form>
    </div>
  );
};
