import { useProductListModel } from "./product-list.model";
import { ProductListView } from "./product-list.view";

const ProductListPage = () => {
  const methods = useProductListModel();
  return <ProductListView {...methods} />;
};

export default ProductListPage;
