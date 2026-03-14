import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tag } from "lucide-react";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";
import { Button } from "../../../shared/components/button";
import { useMutationCategory } from "../hooks/useMutationCategory";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof schema>;

export const CreateCategory = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutationCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await mutateAsync(data);
      toast.success("Categoria criada com sucesso!");
      navigate("/dashboard/categories");
    } catch {
      toast.error("Erro ao criar categoria. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Nova Categoria
        </h2>
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
              {isPending ? "Salvando..." : "Salvar"}
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
