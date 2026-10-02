import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { CatalogBasicFields } from "@/modules/dashboard/components/entity-form/CatalogBasicFields";
import { ProductClassificationSection } from "@/modules/dashboard/components/entity-form/ProductClassificationSection";
import { ProductImageCard } from "@/modules/dashboard/components/entity-form/ProductImageCard";
import { ConfirmModal } from "@/shared/components/Modal/confirm-modal";
import { buttonVariants } from "@/shared/components/button-variants";
import { formatNote } from "@/modules/dashboard/utils/chart-data";
import { Link } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
import { useEditProductModel } from "./edit-product.model";

type EditProductViewProps = ReturnType<typeof useEditProductModel>;

export const EditProductView = ({
  productName,
  images,
  imageDelete,
  reviewsLink,
  averageNote,
  totalReviews,
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
        actions={
          reviewsLink && !isLoading && !loadError ? (
            <Link to={reviewsLink} className={buttonVariants({ color: "outline" })}>
              <MessageSquareText size={18} aria-hidden="true" />
              {totalReviews > 0
                ? `${totalReviews} ${totalReviews === 1 ? "avaliação" : "avaliações"} · ${formatNote(averageNote)}`
                : "Ver avaliações"}
            </Link>
          ) : undefined
        }
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
          <ProductImageCard
            productName={productName}
            images={images}
            onDeleteRequest={imageDelete.request}
            {...upload}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={!!imageDelete.target}
        title="Excluir imagem"
        message={
          <>
            Deseja excluir a <strong className="text-black dark:text-white">{imageDelete.target?.name}</strong> de “
            {productName}”? Imagens importadas (externas) só deixam de ser exibidas; o arquivo original não é apagado.
          </>
        }
        isLoading={imageDelete.isDeleting}
        onConfirm={imageDelete.confirm}
        onClose={imageDelete.cancel}
      />
    </>
  );
};
