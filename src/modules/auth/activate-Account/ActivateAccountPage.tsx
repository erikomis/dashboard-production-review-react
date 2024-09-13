import { ActivateAccountService } from "../services/activateAccount";
import { useActivateAccountModel } from "./activate-account.model";
import { ActivateAccountView } from "./activate-account.view";

const ActivateAccountPage = () => {
  const methods = useActivateAccountModel(ActivateAccountService);
  return <ActivateAccountView {...methods} />;
};

export default ActivateAccountPage;
