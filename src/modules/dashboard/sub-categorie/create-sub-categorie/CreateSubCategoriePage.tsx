import { SubCategorieService } from "../../services/sub-category.service";
import { useCreateCategorieModel } from "./create-sub-categorie.model";
import { CreateSubCategorieView } from "./create-sub-categorie.view";

const CreateSubCategoriePage = () => {
  const medthods = useCreateCategorieModel(SubCategorieService.create);

  return <CreateSubCategorieView {...medthods} />;
};

export default CreateSubCategoriePage;
