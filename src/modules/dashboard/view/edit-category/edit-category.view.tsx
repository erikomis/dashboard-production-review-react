import { Tag } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Button } from "@/shared/components/button";
import { useEditCategoryModel } from "./edit-category.model";

type EditCategoryViewProps = ReturnType<typeof useEditCategoryModel>;

export const EditCategoryView = ({
  register,
  handleSubmit,
  errors,
  isPending,
  isLoading,
  onSubmit,
  navigate,
}: EditCategoryViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">Editar Categoria</h2>
        <button
          onClick={() => navigate("/dashboard/categories")}
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
            placeholder="Nome da categoria"
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

          <div className="flex gap-3 mt-2">
            <Button type="submit" color="default" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button
              type="button"
              color="outline"
              onClick={() => navigate("/dashboard/categories")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
