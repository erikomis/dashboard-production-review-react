import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { CategorySelectField } from "@/modules/dashboard/components/entity-form/CategorySelectField";
import { FormSection } from "@/modules/dashboard/components/form/FormSection";
import { useEditSubCategoryModel } from "./edit-sub-category.model";

type EditSubCategoryViewProps = ReturnType<typeof useEditSubCategoryModel>;

export const EditSubCategoryView = ({
  subCategoryName,
  isLoading,
  loadError,
  nameField,
  slugField,
  descriptionField,
  categoryField,
  regenerateSlug,
  errors,
  isPending,
  categoryOptions,
  isLoadingCategories,
  isCategoriesError,
  onSubmit,
  onCancel,
}: EditSubCategoryViewProps) => {
  return (
    <>
      <PageHeader
        title="Editar subcategoria"
        description={subCategoryName ? `Alterando “${subCategoryName}”.` : "Atualize os dados da subcategoria."}
        breadcrumbs={[{ label: "Subcategorias", to: "/dashboard/sub-categories" }, { label: "Editar" }]}
      />
      <EntityFormLayout
        ariaLabel="Edição de subcategoria"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        isLoading={isLoading}
        loadError={loadError}
        submitLabel="Salvar alterações"
      >
        <FormSection title="Classificação" description="Em qual categoria esta subcategoria fica.">
          <CategorySelectField
            field={categoryField}
            categories={categoryOptions}
            isLoading={isLoadingCategories}
            isError={isCategoriesError}
            error={errors.categorieId?.message}
          />
        </FormSection>
        <CatalogBasicFields
          entityLabel="subcategoria"
          namePlaceholder="Ex.: Celulares"
          descriptionPlaceholder="Ex.: Smartphones e acessórios"
          nameField={nameField}
          slugField={slugField}
          descriptionField={descriptionField}
          regenerateSlug={regenerateSlug}
          errors={errors}
        />
      </EntityFormLayout>
    </>
  );
};
