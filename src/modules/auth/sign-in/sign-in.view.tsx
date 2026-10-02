import { Button } from "@/shared/components/button";
import { Link } from "react-router-dom";
import { useSignInModel } from "./sign-in.model";
import { UserRound } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { AuthHeading } from "../AuthHeading";

type SignInViewProps = ReturnType<typeof useSignInModel>;
export const SignInView = (props: SignInViewProps) => {
  const { errors, handleSubmit, onSubmit, register, isPending } = props;

  return (
    <div className="w-full p-6 sm:p-12.5 xl:p-17.5">
      <AuthHeading title="Entrar no painel" subtitle="Acesso restrito a administradores." />
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isPending || undefined}>
        <Input
          {...register("username")}
          id="username"
          type="text"
          autoComplete="username"
          placeholder="Seu usuário ou e-mail"
          icon={<UserRound size={20} />}
          error={errors.username?.message}
        >
          <Label value="Usuário ou e-mail" htmlFor="username" required />
        </Input>
        <Input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          error={errors.password?.message}
        >
          <Label value="Senha" htmlFor="password" required />
        </Input>
        <div className="mb-6 flex justify-end">
          <Link to="/forgot-password" className="rounded text-sm font-medium text-primary hover:underline dark:text-primary-light">
            Esqueceu a senha?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" isLoading={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
        <p className="mt-6 text-center text-body dark:text-bodydark">
          Não tem conta?{" "}
          <Link to="/sign-up" className="rounded font-medium text-primary hover:underline dark:text-primary-light">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
};
