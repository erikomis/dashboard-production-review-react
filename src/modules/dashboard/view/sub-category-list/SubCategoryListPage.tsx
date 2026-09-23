import { useSubCategoryListModel } from "./sub-category-list.model";
import { SubCategoryListView } from "./sub-category-list.view";

const SubCategoryListPage = () => {
  const methods = useSubCategoryListModel();
  return <SubCategoryListView {...methods} />;
};

export default SubCategoryListPage;
