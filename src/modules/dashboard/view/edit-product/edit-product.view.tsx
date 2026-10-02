import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { ProductClassificationSection } from "@/modules/dashboard/components/entity-form/ProductClassificationSection";
import { ProductImageCard } from "@/modules/dashboard/components/entity-form/ProductImageCard";
import { useEditProductModel } from "./edit-product.model";

type EditProductViewProps = ReturnType<typeof useEditProductModel>;

export const EditProductView = ({
  productName,
  imageUrl,
  nameField,
  slugField,
  descriptionField,
  subCategoryField,
  regenerateSlug,
  errors,
  isPending,
  isLoading,
  loadError,
  options,
  onSubmit,
  onCancel,
  upload,
}: EditProductViewProps) => {
  return (
    <>
      <PageHeader
        title="Editar produto"
        description={productName ? `Alterando “${productName}”.` : "Atualize os dados do produto."}
        breadcrumbs={[{ label: "Produtos", to: "/dashboard/products" }, { label: "Editar" }]}
      />
      <div className="flex flex-col gap-6">
        <EntityFormLayout
          ariaLabel="Edição de produto"
          onSubmit={onSubmit}
          onCancel={onCancel}
          isPending={isPending}
          isLoading={isLoading}
          loadError={loadError}
          submitLabel="Salvar alterações"
        >
          <CatalogBasicFields
            entityLabel="página do produto"
            namePlaceholder="Ex.: Smartphone X"
            descriptionPlaceholder="Principais características do produto"
            nameField={nameField}
            slugField={slugField}
            descriptionField={descriptionField}
            regenerateSlug={regenerateSlug}
            errors={errors}
            descriptionMax={255}
            descriptionRows={5}
          />
          <ProductClassificationSection
            field={subCategoryField}
            subCategories={options.subCategories}
            categories={options.categories}
            isLoading={options.isLoading}
            isError={options.isError}
            error={errors.subCategorieId?.message}
          />
        </EntityFormLayout>

        {!isLoading && !loadError && (
          <ProductImageCard productName={productName} imageUrl={imageUrl} {...upload} />
        )}
      </div>
    </>
  );
};
