import { useCreateCategoryModel } from "./create-category.model";
import { CreateCategoryView } from "./create-category.view";

const CreateCategoryPage = () => {
  const methods = useCreateCategoryModel();
  return <CreateCategoryView {...methods} />;
};

export default CreateCategoryPage;
