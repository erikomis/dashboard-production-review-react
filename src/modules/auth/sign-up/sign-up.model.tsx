import { useState } from "react";
import { SignUpService } from "../services/sign-up";
import { SignUp } from "./sign-up.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { SchemaSignUp } from "./sign-up.schema";
import { useNavigate } from "react-router-dom";

type SignUpServiceProps = typeof SignUpService;

export const useSignUpModel = (SignUpService: SignUpServiceProps) => {
  const navigate = useNavigate();
  const [errosResponse, setErrosResponse] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    resolver: zodResolver(SchemaSignUp),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    try {
      const response = await SignUpService(
        data.name,
        data.email,
        data.username,
        data.password
      );

      if (response.status === 201) {
        navigate("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      setErrosResponse(error.message);
    }
  };

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    errosResponse,
  };
};
