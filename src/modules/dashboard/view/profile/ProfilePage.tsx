import { useProfileModel } from "./profile.model";
import { ProfileView } from "./profile.view";

const ProfilePage = () => {
  const methods = useProfileModel();
  return <ProfileView {...methods} />;
};

export default ProfilePage;
