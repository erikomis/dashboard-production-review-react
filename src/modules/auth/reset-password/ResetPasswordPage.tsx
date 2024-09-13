import { ResetPasswordService } from "../services/reset-password";
import { useResetPasswordModel } from "./reset-password.model";
import { ResetPasswordView } from "./reset-password.view";


const ResetPasswordPage = () => {
  const methods = useResetPasswordModel(ResetPasswordService);
  return <ResetPasswordView {...methods} />;
};

export default ResetPasswordPage;