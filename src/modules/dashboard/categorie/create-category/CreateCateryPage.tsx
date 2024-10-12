import { CategoryService } from "../../services/category.service";
import { useCreateCategoryModel } from "./create-category.model";
import { CreateCategorieView } from "./create-category.view";

const CreateCateriePage = () => {
  const methods = useCreateCategoryModel(CategoryService.create);
  return <CreateCategorieView {...methods} />;
};

export default CreateCateriePage;
