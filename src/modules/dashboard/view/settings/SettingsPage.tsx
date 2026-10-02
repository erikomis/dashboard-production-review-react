import { useSettingsModel } from "./settings.model";
import { SettingsView } from "./settings.view";

const SettingsPage = () => {
  const methods = useSettingsModel();
  return <SettingsView {...methods} />;
};

export default SettingsPage;
