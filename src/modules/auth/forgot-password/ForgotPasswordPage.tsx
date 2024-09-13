import { ForgotPasswordService } from "../services/forgot-password";
import { useForgotPasswordModel } from "./forgot-password.model";
import { ForgotPasswordView } from "./forgot-password.view";

const ForgotPasswordPage = () => {
  const methods = useForgotPasswordModel(ForgotPasswordService);
  return <ForgotPasswordView {...methods} />;
};

export default ForgotPasswordPage;
