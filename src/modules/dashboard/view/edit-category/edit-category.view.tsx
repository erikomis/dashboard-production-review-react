import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { useEditCategoryModel } from "./edit-category.model";

type EditCategoryViewProps = ReturnType<typeof useEditCategoryModel>;

export const EditCategoryView = ({
  categoryName,
  nameField,
  slugField,
  descriptionField,
  regenerateSlug,
  errors,
  isPending,
  isLoading,
  loadError,
  onSubmit,
  onCancel,
}: EditCategoryViewProps) => {
  return (
    <>
      <PageHeader
        title="Editar categoria"
        description={categoryName ? `Alterando “${categoryName}”.` : "Atualize os dados da categoria."}
        breadcrumbs={[{ label: "Categorias", to: "/dashboard/categories" }, { label: "Editar" }]}
      />
      <EntityFormLayout
        ariaLabel="Edição de categoria"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        isLoading={isLoading}
        loadError={loadError}
        submitLabel="Salvar alterações"
      >
        <CatalogBasicFields
          entityLabel="categoria"
          namePlaceholder="Ex.: Eletrônicos"
          descriptionPlaceholder="Ex.: Aparelhos eletrônicos em geral"
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
