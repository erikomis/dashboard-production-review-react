import { Tag } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Button } from "@/shared/components/button";
import { useCreateSubCategoryModel } from "./create-sub-category.model";

type CreateSubCategoryViewProps = ReturnType<typeof useCreateSubCategoryModel>;

export const CreateSubCategoryView = ({
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
  navigate,
  categoryOptions,
}: CreateSubCategoryViewProps) => {
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Nova Subcategoria</h2>
        <button
          onClick={() => navigate("/dashboard/sub-categories")}
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
        >
          ← Voltar
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            color="primary"
            id="name"
            type="text"
            placeholder="Nome da subcategoria"
            icon={<Tag size={20} />}
            error={errors.name?.message}
            {...register("name")}
          >
            <Label value="Nome:" htmlFor="name" />
          </Input>

          <Input
            color="primary"
            id="description"
            type="text"
            placeholder="Descrição (opcional)"
            error={errors.description?.message}
            {...register("description")}
          >
            <Label value="Descrição:" htmlFor="description" />
          </Input>

          <div className="flex flex-col gap-1">
            <Label value="Categoria:" htmlFor="categoryId" />
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="">Selecione uma categoria</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-sm text-danger">{errors.categoryId.message}</span>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="submit" color="default" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              color="outline"
              onClick={() => navigate("/dashboard/sub-categories")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
