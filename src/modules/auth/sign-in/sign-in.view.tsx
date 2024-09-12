import { Button } from "../../../shared/components/button";
import { Link } from "react-router-dom";
import { useSignInModel } from "./sign-in.model";
import { Eye, Mail } from "lucide-react";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";

type SignInViewProps = ReturnType<typeof useSignInModel>;
export const SignInView = (props: SignInViewProps) => {
  const { errors,  handleSubmit, onSubmit, register } = props;

  return (
    <div className="w-full p-2 sm:p-12.5 xl:p-17.5">
      <span className="mb-1.5 block font-medium">
        Dashboard production review
      </span>
      <h2 className="text-2xl font-bold text-black mb-9 dark:text-white sm:text-title-xl2">
        Sign in to your account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("username")}
          color="primary"
          name="username"
          id="email"
          type="text"
          autoComplete="username"
          placeholder="Entre com seu username"
          icon={<Mail size={24} />}
          children={<Label value="Username:" htmlFor="email" />}
          error={errors.username?.message}
        />
        <Input
          {...register("password")}
          color="primary"
          name="password"
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Entre com sua senha"
          icon={<Eye size={24} />}
          children={<Label value="Password:" htmlFor="password" />}
          error={errors.password?.message}
        />
        <div className="flex justify-end mb-2">
          <Link to="/forgot-password" className="text-primary">
            Esqueceu a senha?
          </Link>
        </div>
        <div className="mb-5">
          <Button
            type="submit"
            value="Entrar"
            color="default"
            size="lg"
            className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          />
        </div>
        <div className="mt-6 text-center">
          <p>
            Você não tem conta ?{" "}
            <Link to="/sign-up" className="text-primary">
              Criar Conta
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
