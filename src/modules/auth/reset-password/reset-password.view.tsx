import { Link } from "react-router-dom";
import { CircleAlert, KeyRound, Mail } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { useResetPasswordModel } from "./reset-password.model";
import { AuthHeading } from "../AuthHeading";

type ResetPasswordProps = ReturnType<typeof useResetPasswordModel>;

export const ResetPasswordView = (props: ResetPasswordProps) => {
  const { errors, handleSubmit, onSubmit, register, errosResponse, isSubmitting } = props;
  return (
    <div className="w-full p-6 sm:p-12.5 xl:p-17.5">
      <AuthHeading
        title="Redefinir senha"
        subtitle="Digite o código de 6 dígitos que enviamos para o seu e-mail e escolha uma nova senha."
      />

      <div aria-live="assertive">
        {errosResponse && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger dark:text-danger-light"
          >
            <CircleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
            {errosResponse}
          </div>
        )}
      </div>
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
        <Input
          {...register("recoveryCode")}
          id="recoveryCode"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          icon={<KeyRound size={20} />}
          className="font-mono tracking-[0.3em]"
          error={errors.recoveryCode?.message}
        >
          <Label value="Código de verificação" htmlFor="recoveryCode" required />
        </Input>
        <Input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="De 6 a 20 caracteres"
          error={errors.password?.message}
        >
          <Label value="Nova senha" htmlFor="password" required />
        </Input>
        <Input
          {...register("passwordConfirm")}
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          error={errors.passwordConfirm?.message}
        >
          <Label value="Confirmar nova senha" htmlFor="passwordConfirm" required />
        </Input>

        <Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </Button>

        <p className="mt-6 text-center text-body dark:text-bodydark">
          <Link to="/forgot-password" className="rounded font-medium text-primary hover:underline dark:text-primary-light">
            Reenviar código
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
