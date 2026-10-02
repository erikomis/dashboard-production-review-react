import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { CategorySelectField } from "@/modules/dashboard/components/entity-form/CategorySelectField";
import { FormSection } from "@/modules/dashboard/components/form/FormSection";
import { useCreateSubCategoryModel } from "./create-sub-category.model";

type CreateSubCategoryViewProps = ReturnType<typeof useCreateSubCategoryModel>;

export const CreateSubCategoryView = ({
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
}: CreateSubCategoryViewProps) => {
  return (
    <>
      <PageHeader
        title="Nova subcategoria"
        description="Cadastre uma subcategoria e vincule-a a uma categoria existente."
        breadcrumbs={[{ label: "Subcategorias", to: "/dashboard/sub-categories" }, { label: "Nova" }]}
      />
      <EntityFormLayout
        ariaLabel="Cadastro de subcategoria"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Criar subcategoria"
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
