import { useEditCategoryModel } from "./edit-category.model";
import { EditCategoryView } from "./edit-category.view";

const EditCategoryPage = () => {
  const methods = useEditCategoryModel();
  return <EditCategoryView {...methods} />;
};

export default EditCategoryPage;
