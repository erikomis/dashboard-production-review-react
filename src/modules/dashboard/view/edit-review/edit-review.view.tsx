import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { ReviewFormFields } from "@/modules/dashboard/components/entity-form/ReviewFormFields";
import { useEditReviewModel } from "./edit-review.model";

type EditReviewViewProps = ReturnType<typeof useEditReviewModel>;

export const EditReviewView = ({
  reviewTitle,
  titleField,
  descriptionField,
  productField,
  note,
  setNote,
  errors,
  isPending,
  isLoading,
  loadError,
  productOptions,
  onSubmit,
  onCancel,
}: EditReviewViewProps) => {
  return (
    <>
      <PageHeader
        title="Editar avaliação"
        description={reviewTitle ? `Alterando “${reviewTitle}”.` : "Atualize os dados da avaliação."}
        breadcrumbs={[{ label: "Avaliações", to: "/dashboard/review" }, { label: "Editar" }]}
      />
      <EntityFormLayout
        ariaLabel="Edição de avaliação"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        isLoading={isLoading}
        loadError={loadError}
        submitLabel="Salvar alterações"
      >
        <ReviewFormFields
          titleField={titleField}
          descriptionField={descriptionField}
          productField={productField}
          note={note}
          setNote={setNote}
          errors={errors}
          productOptions={productOptions}
        />
      </EntityFormLayout>
    </>
  );
};
