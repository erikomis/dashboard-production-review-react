import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { useCreateCategoryModel } from "./create-category.model";

type CreateCategoryViewProps = ReturnType<typeof useCreateCategoryModel>;

export const CreateCategoryView = ({
  nameField,
  slugField,
  descriptionField,
  regenerateSlug,
  errors,
  isPending,
  onSubmit,
  onCancel,
}: CreateCategoryViewProps) => {
  return (
    <>
      <PageHeader
        title="Nova categoria"
        description="Preencha os dados para cadastrar uma categoria no catálogo."
        breadcrumbs={[{ label: "Categorias", to: "/dashboard/categories" }, { label: "Nova" }]}
      />
      <EntityFormLayout
        ariaLabel="Cadastro de categoria"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        submitLabel="Criar categoria"
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
