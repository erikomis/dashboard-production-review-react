import { useMutation } from "@tanstack/react-query";
import { SignInService } from "../services/sign-in";

export const useMutationUser = () =>
  useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => SignInService({ username, password }),
  });
