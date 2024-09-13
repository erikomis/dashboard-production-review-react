import { SignInService } from "../services/sign-in";
import { useSignInModel } from "./sign-in.model";
import { SignInView } from "./sign-in.view";

const SignInPage = () => {
  const methods = useSignInModel(SignInService);
  return <SignInView {...methods} />;
};

export default SignInPage;
