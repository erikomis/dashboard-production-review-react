import { useForm, useController, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationReview } from "@/modules/dashboard/hooks/useMutationReview";
import { useProductOptions } from "@/modules/dashboard/hooks/useProductOptions";
import { getErrorMessage } from "@/shared/utils/error-message";
import { SchemaCreateReview } from "./create-review.schema";
import { CreateReviewValues } from "./create-review.type";

export const useCreateReviewModel = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationReview();
  const productOptions = useProductOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateReviewValues>({
    resolver: zodResolver(SchemaCreateReview),
    defaultValues: { title: "", description: "", note: 0 },
  });
  const { field: noteField } = useController({ control, name: "note" });

  const onSubmit: SubmitHandler<CreateReviewValues> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success("Avaliação criada com sucesso!");
      navigate("/dashboard/review");
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao criar avaliação. Tente novamente."));
    }
  };

  return {
    titleField: register("title"),
    descriptionField: register("description"),
    productField: register("productId"),
    note: Number(noteField.value) || 0,
    setNote: (value: number) => noteField.onChange(value),
    errors,
    isPending,
    productOptions,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/review"),
  };
};
