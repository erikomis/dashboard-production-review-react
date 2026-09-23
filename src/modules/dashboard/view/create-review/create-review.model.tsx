import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutationReview } from "@/modules/dashboard/hooks/useMutationReview";
import { useQueryProducts } from "@/modules/dashboard/hooks/useQueryProducts";
import { SchemaCreateReview } from "./create-review.schema";
import { CreateReviewValues } from "./create-review.type";
import { Product } from "@/shared/types/product";

export const useCreateReviewModel = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationReview();
  const { data: productsData } = useQueryProducts();
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReviewValues>({
    resolver: zodResolver(SchemaCreateReview),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  const onSubmit: SubmitHandler<CreateReviewValues> = async (data) => {
    try {
      await mutateAsync(data);
      toast.success("Avaliação criada com sucesso!");
      navigate("/dashboard/review");
    } catch {
      toast.error("Erro ao criar avaliação. Tente novamente.");
    }
  };

  const products: Product[] = productsData?.content ?? [];

  return {
    register,
    handleSubmit,
    setValue,
    errors,
    isPending,
    onSubmit,
    navigate,
    rating,
    hoverRating,
    setHoverRating,
    products,
  };
};
