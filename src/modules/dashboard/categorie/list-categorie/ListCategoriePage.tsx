import { CategoryService } from "../../services/category.service";
import { useDeleteCategoryModel } from "../delete-category/delete-category.model";
import { DeleteCategoryView } from "../delete-category/delete-category.view";
import { useUpdateCategoryModel } from "../update-category/update-category.model";
import { UpdateCategoryView } from "../update-category/update-category.view";
import { useListCategoryModel } from "./list-category.model";
import { ListCategoryView } from "./list-category.view";

const ListCategoriePage = () => {
  const methods = useListCategoryModel();
  const methodsUpdate = useUpdateCategoryModel(CategoryService.update);
  const methodsDelete = useDeleteCategoryModel(CategoryService.delete);

  return (
    <>
      <ListCategoryView
        {...methods}
        UpdateCategory={methodsUpdate.updateCategory}
        deleleteCategory={methodsDelete.onDeleteCategory}
      />
      <UpdateCategoryView {...methodsUpdate} />
      <DeleteCategoryView {...methodsDelete} />
    </>
  );
};

export default ListCategoriePage;
