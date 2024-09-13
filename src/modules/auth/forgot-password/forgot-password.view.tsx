import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/button";
import { Input } from "../../../shared/components/input";
import { Mail } from "lucide-react";
import { Label } from "../../../shared/components/label";
import { useForgotPasswordModel } from "./forgot-password.model";
type ForgotPasswordProps = ReturnType<typeof useForgotPasswordModel>;
export const ForgotPasswordView = (props: ForgotPasswordProps) => {
  const { errors, handleSubmit, onSubmit, register } = props;

  return (
    <div className="w-full p-2 sm:p-12.5 xl:p-17.5">
      <span className="mb-1.5 block font-medium">
        Dashboard production review
      </span>
      <h2 className="text-2xl font-bold text-black mb-9 dark:text-white sm:text-title-xl2">
        Esqueci minha senha
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("email")}
          color="primary"
          name="email"
          id="email"
          type="email"
          placeholder="Entre com seu email"
          icon={<Mail size={24} />}
          children={<Label value="Email:" htmlFor="email" />}
          error={errors.email?.message}
        />
        <div className="mb-5">
          <Button
            type="submit"
            value="Enviar email"
            color="default"
            size="lg"
            className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          />
        </div>
        <div className="mt-6 text-center">
          <p>
            <Link to="/" className="text-primary">
              volta para login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
