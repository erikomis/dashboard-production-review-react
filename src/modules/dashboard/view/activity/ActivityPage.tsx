import { useActivityModel } from "./activity.model";
import { ActivityView } from "./activity.view";

const ActivityPage = () => {
  const methods = useActivityModel();
  return <ActivityView {...methods} />;
};

export default ActivityPage;
