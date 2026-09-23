import { useHomeModel } from "./home.model";
import { HomeView } from "./home.view";

const HomePage = () => {
  const methods = useHomeModel();
  return <HomeView {...methods} />;
};

export default HomePage;
