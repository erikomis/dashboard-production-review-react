import { Eye, Mail, User } from "lucide-react";
import { Input } from "../../../shared/components/input";
import { Button } from "../../../shared/components/button";
import { Link } from "react-router-dom";
import { Label } from "../../../shared/components/label";
import { useSignUpModel } from "./sign-up.model";

type SignUpViewProps = ReturnType<typeof useSignUpModel>;

export const SignUpView = (props: SignUpViewProps) => {
  const { errors, handleSubmit, onSubmit, register } = props;
  return (
    <div className="w-full  p-4 sm:p-12.5 xl:p-17.5">
      <p className="block mb-1 font-medium">Dashboard production review</p>
      <h2 className="mb-2 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Sign up to your account
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("name")}
          color="primary"
          name="name"
          id="name"
          type="text"
          placeholder="Entre com seu nome"
          children={<Label value="Nome:" htmlFor="name" />}
          error={errors.username?.message}
        />
        <Input
          {...register("username")}
          color="primary"
          name="username"
          autoComplete="username"
          id="username"
          type="text"
          placeholder="Entre com seu username"
          icon={<User size={24} />}
          children={<Label value="Username:" htmlFor="username" />}
          error={errors.username?.message}
        />
        <Input
          {...register("email")}
          color="primary"
          name="email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Entre com seu email"
          icon={<Mail size={24} />}
          children={<Label value="Email:" htmlFor="email" />}
          error={errors.email?.message}
        />
        <Input
          {...register("password")}
          color="primary"
          name="password"
          id="password"
          autoComplete="current-password"
          type="password"
          placeholder="6+ Characters, 1 Capital letter"
          icon={<Eye size={24} />}
          children={<Label value="Password:" htmlFor="password" />}
          error={errors.password?.message}
        />
        <Input
          {...register("passwordConfirm")}
          color="primary"
          name="passwordConfirm"
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="6+ Characters,"
          icon={<Eye size={24} />}
          children={
            <Label value="Password Confirm:" htmlFor="passwordConfirm" />
          }
          error={errors.passwordConfirm?.message}
        />

        <div className="mb-5">
          <Button
            type="submit"
            value={"Sign In"}
            color="default"
            size="lg"
            className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          />
        </div>

        <div className="mt-6 text-center">
          <p>
            Você ja tem conta ?{" "}
            <Link to="/" className="text-primary">
              Logar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
