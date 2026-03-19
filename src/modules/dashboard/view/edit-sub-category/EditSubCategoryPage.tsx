import { useEditSubCategoryModel } from "./edit-sub-category.model";
import { EditSubCategoryView } from "./edit-sub-category.view";

const EditSubCategoryPage = () => {
  const methods = useEditSubCategoryModel();
  return <EditSubCategoryView {...methods} />;
};

export default EditSubCategoryPage;
