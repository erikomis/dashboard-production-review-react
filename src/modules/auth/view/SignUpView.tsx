import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/button";
import { Eye, Mail, User } from "lucide-react";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";
import { SignUpViewModel } from "../modelView/SignUpViewModel";

const SignUpView = () => {
  const { errors, errosResponse, handleSubmit, onSubmit, register } =
    SignUpViewModel();

  return (
    <div className="w-full  p-4 sm:p-12.5 xl:p-17.5">
      <p className="block mb-1 font-medium">
        Dashboard production review
      </p>
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
          {...register("name")}
          color="primary"
          name="name"
          id="name"
          type="text"
          placeholder="Enter your name"
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
          placeholder="Enter your username"
          icon={<User size={24} />}
          children={<Label value="Username:" htmlFor="username" />}
          error={errors.username?.message}
        />
        <Input
          {...register("email")}
          color="primary"
          name="username"
          id="email"
          type="text"
          placeholder="Enter your email"
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
          {...register("password")}
          color="primary"
          name="password"
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

export default SignUpView;
