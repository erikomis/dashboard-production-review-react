import { useImportCatalogModel } from "./import-catalog.model";
import { ImportCatalogView } from "./import-catalog.view";

const ImportCatalogPage = () => {
  const methods = useImportCatalogModel();
  return <ImportCatalogView {...methods} />;
};

export default ImportCatalogPage;
