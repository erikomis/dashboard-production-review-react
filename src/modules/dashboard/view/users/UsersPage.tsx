import { useUsersModel } from "./users.model";
import { UsersView } from "./users.view";

const UsersPage = () => {
  const methods = useUsersModel();
  return <UsersView {...methods} />;
};

export default UsersPage;
