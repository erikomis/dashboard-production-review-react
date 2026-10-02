import { PageHeader } from "@/modules/dashboard/components/page-header/PageHeader";
import { EntityFormLayout } from "@/modules/dashboard/components/entity-form/EntityFormLayout";
import { ReviewFormFields } from "@/modules/dashboard/components/entity-form/ReviewFormFields";
import { useCreateReviewModel } from "./create-review.model";

type CreateReviewViewProps = ReturnType<typeof useCreateReviewModel>;

export const CreateReviewView = ({
  titleField,
  descriptionField,
  productField,
  note,
  setNote,
  errors,
  isPending,
  productOptions,
  onSubmit,
  onCancel,
}: CreateReviewViewProps) => {
  return (
    <>
      <PageHeader
        title="Nova avaliação"
        description="A avaliação será publicada em nome da sua conta."
        breadcrumbs={[{ label: "Avaliações", to: "/dashboard/review" }, { label: "Nova" }]}
      />
      <EntityFormLayout
        ariaLabel="Cadastro de avaliação"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isPending={isPending}
        pendingLabel="Publicando..."
        submitLabel="Publicar avaliação"
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
