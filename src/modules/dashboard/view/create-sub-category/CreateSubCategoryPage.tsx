import { useCreateSubCategoryModel } from "./create-sub-category.model";
import { CreateSubCategoryView } from "./create-sub-category.view";

const CreateSubCategoryPage = () => {
  const methods = useCreateSubCategoryModel();
  return <CreateSubCategoryView {...methods} />;
};

export default CreateSubCategoryPage;
