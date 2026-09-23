import { useEditProductModel } from "./edit-product.model";
import { EditProductView } from "./edit-product.view";

const EditProductPage = () => {
  const methods = useEditProductModel();
  return <EditProductView {...methods} />;
};

export default EditProductPage;
