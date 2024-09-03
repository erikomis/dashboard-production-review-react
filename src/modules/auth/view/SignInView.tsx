import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/button";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";
import { Eye, Mail } from "lucide-react";
import { SignInModelView } from "../modelView/SignInModelView";

const LoginView = () => {
  const { handleSubmit, onSubmit, register, errors } = SignInModelView();
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
          placeholder="Enter your email"
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
          placeholder="6+ Characters, 1 Capital letter"
          icon={<Eye size={24} />}
          children={<Label value="Password:" htmlFor="password" />}
          error={errors.password?.message}
        />
        <div className="flex justify-end mb-2">
          <Link to="/forgot-password" className="text-primary">
            Forgot password?
          </Link>
        </div>
        <div className="mb-5">
          <Button
            type="submit"
            value={"Sign In"}
            color="default"
            size="lg"
            className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          />
        </div>

        {/* <Button
          type="button"
          className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
        >
          <span>
            <Google />
          </span>
          Sign in with Google
        </Button> */}

        <div className="mt-6 text-center">
          <p>
            Você nao tem conta ?{" "}
            <Link to="/sign-up" className="text-primary">
              Criar Conta
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginView;
