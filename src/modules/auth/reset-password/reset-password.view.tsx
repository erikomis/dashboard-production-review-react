import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/button";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";
import { useResetPasswordModel } from "./reset-password.model";
import { Eye, Mail } from "lucide-react";

type ResetPasswordProps = ReturnType<typeof useResetPasswordModel>;

export const ResetPasswordView = (props: ResetPasswordProps) => {
  const { errors, handleSubmit, onSubmit, register ,errosResponse} = props;
  return (
    <div className="w-full  p-4 sm:p-12.5 xl:p-17.5">
      <p className="block mb-1 font-medium">Dashboard production review</p>
      <h2 className="mb-2 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Sign up to your account
      </h2>

      {errosResponse && (
        <div className="p-2 mb-1 rounded bg-danger">
          <span className="text-slate-200"> {errosResponse}</span>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("email")}
          color="primary"
          name="email"
          autoComplete="email"
          id="email"
          type="email"
          placeholder="Entre com seu email"
          icon={<Mail size={24} />}
          children={<Label value="Email:" htmlFor="email" />}
          error={errors.email?.message}
        />
        <Input
          {...register("recoveryCode")}
          color="primary"
          name="recoveryCode"
          id="recoveryCode"
          type="text"
          autoComplete="recoveryCode"
          placeholder="Entre com seu código de recuperação"
          icon={<Mail size={24} />}
          children={<Label value="Codigo de verificação:" htmlFor="Codigo de recuperação" />}
          error={errors.recoveryCode?.message}
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
            <Link to="/" className="text-primary">
              Logar
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
