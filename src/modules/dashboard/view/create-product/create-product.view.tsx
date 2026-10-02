import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { ProductClassificationSection } from "@/modules/dashboard/components/entity-form/ProductClassificationSection";
import { useCreateProductModel } from "./create-product.model";

type CreateProductViewProps = ReturnType<typeof useCreateProductModel>;

export const CreateProductView = ({
  nameField,
  slugField,
  descriptionField,
  subCategoryField,
  regenerateSlug,
  errors,
  isPending,
  options,
  onSubmit,
  onCancel,
}: CreateProductViewProps) => {
  return (
    <>
      <PageHeader
        title="Novo produto"
        description="Cadastre o produto. Depois de salvar você poderá enviar a imagem."
        breadcrumbs={[{ label: "Produtos", to: "/dashboard/products" }, { label: "Novo" }]}
      />
      <EntityFormLayout
        ariaLabel="Cadastro de produto"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Criar produto"
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
    </>
  );
};
