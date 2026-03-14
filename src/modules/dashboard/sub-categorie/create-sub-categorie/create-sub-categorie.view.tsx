import { Button } from "../../../../shared/components/button";
import { Input } from "../../../../shared/components/input";
import { Label } from "../../../../shared/components/label";
import { Options } from "../../../../shared/components/options";
import { SelectGroupOne } from "../../../../shared/components/select";
import { useQueryCategory } from "../../hooks/category/useQueryCategory";
import { useCreateCategorieModel } from "./create-sub-categorie.model";

type CreateSubCategorieViewProps = ReturnType<typeof useCreateCategorieModel>;

export const CreateSubCategorieView = (props: CreateSubCategorieViewProps) => {
  const { errors, handleSubmit, onSubmit, register } = props;
  const { data, isLoading } = useQueryCategory();
  return (
    <div className="flex flex-col gap-10 overflow-auto">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name")}
            color="primary"
            name="name"
            id="name"
            type="text"
            autoComplete="off"
            placeholder="Entre com o nome da categoria"
            children={<Label value="Nome:" htmlFor="name" />}
            className="md:w-full sm:w-full lg:w-80"
            error={errors.name?.message}
          />
          <Input
            {...register("description")}
            color="primary"
            name="description"
            id="description"
            type="text"
            autoComplete="off"
            placeholder="Entre com a descrição da categoria"
            children={<Label value="Descrição:" htmlFor="description" />}
            className="md:w-full sm:w-full lg:w-80"
            error={errors.description?.message}
          />
          <Input
            {...register("slug")}
            color="primary"
            name="slug"
            id="slug"
            type="text"
            autoComplete="off"
            placeholder="Entre com o slug da categoria"
            children={<Label value="Slug:" htmlFor="slug" />}
            className="md:w-full sm:w-full lg:w-80"
            error={errors.slug?.message}
          />
          <SelectGroupOne
            Label={<Label value="Categoria" htmlFor="categoria" />}
            id="categorieId"
            {...register("categorieId")}
            name="categorieId"
            error={errors.categorieId?.message}
          >
            {isLoading && <Options value="">Carregando...</Options>}
            <Options value="">Selecione uma categoria</Options>
            {!isLoading &&
              data?.map((category) => (
                <Options key={category.id} value={category.id}>
                  {category.name}
                </Options>
              ))}
          </SelectGroupOne>
          <Button
            type="submit"
            value="Criar categoria"
            color="default"
            size="lg"
            className="flex p-4 mb-2 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          />
        </form>
      </div>
    </div>
  );
};
