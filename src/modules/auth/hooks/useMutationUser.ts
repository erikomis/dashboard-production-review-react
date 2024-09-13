import { useMutation } from "@tanstack/react-query";
import { SignInService } from "../services/sign-in";

type MutationSignInProps = {
  service: typeof SignInService;
};

export const useMutationUser = ({ service }: MutationSignInProps) =>
  useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => service({ username, password }),
  });
