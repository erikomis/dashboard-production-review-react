import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ReviewService } from "@/modules/dashboard/services/review.service";
import { useMutationUpdateReview } from "@/modules/dashboard/hooks/useMutationReview";
import { SchemaEditReview } from "./edit-review.schema";
import { EditReviewValues } from "./edit-review.type";

export const useEditReviewModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
  const { mutateAsync: updateReview, isPending } = useMutationUpdateReview();

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => ReviewService.getById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditReviewValues>({
    resolver: zodResolver(SchemaEditReview),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  useEffect(() => {
    if (data) {
      reset({ title: data.title, content: data.content, rating: data.rating });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<EditReviewValues> = async (formData) => {
    try {
      await updateReview({ id: id!, ...formData, productId: data!.productId });
      toast.success("Avaliação atualizada com sucesso!");
      navigate("/dashboard/review");
    } catch {
      toast.error("Erro ao atualizar avaliação. Tente novamente.");
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    isPending,
    isLoading,
    onSubmit,
    navigate,
    rating,
    hoverRating,
    setHoverRating,
  };
};
