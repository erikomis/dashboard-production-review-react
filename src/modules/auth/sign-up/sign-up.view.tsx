import { AtSign, Mail } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import { Link } from "react-router-dom";
import { Label } from "@/shared/components/label";
import { useSignUpModel } from "./sign-up.model";
import { AuthHeading } from "../AuthHeading";

type SignUpViewProps = ReturnType<typeof useSignUpModel>;

export const SignUpView = (props: SignUpViewProps) => {
  const { errors, handleSubmit, onSubmit, register, isSubmitting } = props;
  return (
    <div className="w-full p-6 sm:p-12.5 xl:p-17.5">
      <AuthHeading
        title="Criar conta"
        subtitle="Você receberá um e-mail para ativar a conta antes de entrar."
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isSubmitting || undefined}>
        <Input {...register("name")} id="name" autoComplete="name" placeholder="Seu nome completo" error={errors.name?.message}>
          <Label value="Nome" htmlFor="name" required />
        </Input>
        <Input
          {...register("username")}
          id="username"
          autoComplete="username"
          placeholder="Como você quer ser identificado"
          icon={<AtSign size={20} />}
          error={errors.username?.message}
        >
          <Label value="Usuário" htmlFor="username" required />
        </Input>
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
          {...register("password")}
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="De 6 a 20 caracteres"
          hint="Use de 6 a 20 caracteres."
          error={errors.password?.message}
        >
          <Label value="Senha" htmlFor="password" required />
        </Input>
        <Input
          {...register("passwordConfirm")}
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          error={errors.passwordConfirm?.message}
        >
          <Label value="Confirmar senha" htmlFor="passwordConfirm" required />
        </Input>

        <Button type="submit" size="lg" className="mt-2 w-full" isLoading={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <p className="mt-6 text-center text-body dark:text-bodydark">
          Já tem conta?{" "}
          <Link to="/" className="rounded font-medium text-primary hover:underline dark:text-primary-light">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
};
