import { Star } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Button } from "@/shared/components/button";
import { useCreateReviewModel } from "./create-review.model";

type CreateReviewViewProps = ReturnType<typeof useCreateReviewModel>;

export const CreateReviewView = ({
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
}: CreateReviewViewProps) => {
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Nova Avaliação</h2>
        <button
          onClick={() => navigate("/dashboard/review")}
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
        >
          ← Voltar
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            color="primary"
            id="title"
            type="text"
            placeholder="Título da avaliação"
            error={errors.title?.message}
            {...register("title")}
          >
            <Label value="Título:" htmlFor="title" />
          </Input>

          <div className="flex flex-col gap-1">
            <Label value="Produto:" htmlFor="productId" />
            <select
              id="productId"
              {...register("productId")}
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Selecione um produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <span className="text-sm text-danger">{errors.productId.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label value="Nota:" htmlFor="rating" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setValue("rating", value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        value <= (hoverRating || rating)
                          ? "text-warning fill-warning"
                          : "text-gray-300 fill-gray-300"
                      }
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-gray-500">
                {rating > 0 ? `${rating}/5` : "Selecione uma nota"}
              </span>
            </div>
            {errors.rating && (
              <span className="text-sm text-danger">Selecione uma nota</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label value="Conteúdo:" htmlFor="content" />
            <textarea
              id="content"
              {...register("content")}
              rows={5}
              placeholder="Descreva a avaliação..."
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary resize-none"
            />
            {errors.content && (
              <span className="text-sm text-danger">{errors.content.message}</span>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="submit" color="default" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              color="outline"
              onClick={() => navigate("/dashboard/review")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
