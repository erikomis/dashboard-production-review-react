import { useCategoryListModel } from "./category-list.model";
import { CategoryListView } from "./category-list.view";

const CategoryListPage = () => {
  const methods = useCategoryListModel();
  return <CategoryListView {...methods} />;
};

export default CategoryListPage;
