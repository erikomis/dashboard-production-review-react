import { useEffect } from "react";
import { useForm, useController, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryReviewById } from "@/modules/dashboard/hooks/useQueryReviews";
import { useMutationUpdateReview } from "@/modules/dashboard/hooks/useMutationReview";
import { useProductOptions } from "@/modules/dashboard/hooks/useProductOptions";
import { getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { SchemaEditReview } from "./edit-review.schema";
import { EditReviewValues } from "./edit-review.type";

export const useEditReviewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: updateReview, isPending } = useMutationUpdateReview();
  const { data, isLoading, isError, error, refetch } = useQueryReviewById(id);
  const productOptions = useProductOptions();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditReviewValues>({
    resolver: zodResolver(SchemaEditReview),
    defaultValues: { title: "", description: "", note: 0 },
  });
  const { field: noteField } = useController({ control, name: "note" });

  useEffect(() => {
    if (data && productOptions.isReady) {
      reset({
        title: data.title,
        description: data.description,
        note: data.note,
        productId: data.productId,
      });
    }
  }, [data, productOptions.isReady, reset]);

  const onSubmit: SubmitHandler<EditReviewValues> = async (formData) => {
    try {
      await updateReview({ id: id!, ...formData });
      toast.success("Avaliação atualizada com sucesso!");
      navigate("/dashboard/review");
    } catch (err) {
      // 403 quando não é o autor nem ADMIN
      toast.error(getErrorMessage(err, "Erro ao atualizar avaliação. Tente novamente."));
    }
  };

  const loadError = isError
    ? getErrorStatus(error) === 404
      ? { title: "Avaliação não encontrada", description: "Ela pode ter sido excluída." }
      : {
          title: "Erro ao carregar a avaliação",
          description: getErrorMessage(error),
          onRetry: () => void refetch(),
        }
    : null;

  return {
    reviewTitle: data?.title,
    titleField: register("title"),
    descriptionField: register("description"),
    productField: register("productId"),
    note: Number(noteField.value) || 0,
    setNote: (value: number) => noteField.onChange(value),
    errors,
    isPending,
    isLoading: isLoading || productOptions.isLoading,
    loadError,
    productOptions,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/review"),
  };
};
