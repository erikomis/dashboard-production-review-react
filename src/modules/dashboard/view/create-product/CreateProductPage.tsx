import { useCreateProductModel } from "./create-product.model";
import { CreateProductView } from "./create-product.view";

const CreateProductPage = () => {
  const methods = useCreateProductModel();
  return <CreateProductView {...methods} />;
};

export default CreateProductPage;
