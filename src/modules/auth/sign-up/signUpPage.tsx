import { SignUpService } from "../services/sign-up";
import { useSignUpModel } from "./sign-up.model";
import { SignUpView } from "./sign-up.view";

const SignUpPage = () => {
  const methods = useSignUpModel(SignUpService);
  return <SignUpView {...methods} />;
};

export default SignUpPage;
