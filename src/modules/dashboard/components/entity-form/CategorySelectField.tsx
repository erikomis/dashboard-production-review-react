import { Link } from "react-router-dom";
import { UseFormRegisterReturn } from "react-hook-form";
import { SelectField } from "@/shared/components/select-field";
import { Label } from "@/shared/components/label";
import { Category } from "@/shared/types/category";

type Props = {
  field: UseFormRegisterReturn;
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
};

/** Select de categoria alimentado por `/category/list`. */
export const CategorySelectField = ({ field, categories, isLoading, isError, error }: Props) => (
  <SelectField
    id="categorieId"
    label={<Label value="Categoria" htmlFor="categorieId" required />}
    error={error ?? (isError ? "Não foi possível carregar as categorias." : undefined)}
    disabled={isLoading || isError}
    aria-required="true"
    hint={
      !isLoading && !isError && categories.length === 0 ? (
        <>
          Nenhuma categoria cadastrada.{" "}
          <Link to="/dashboard/categories/add" className="font-medium text-primary underline dark:text-primary-light">
            Criar categoria
          </Link>
        </>
      ) : (
        "A subcategoria será exibida dentro desta categoria."
      )
    }
    {...field}
  >
    <option value="">{isLoading ? "Carregando categorias..." : "Selecione uma categoria"}</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </SelectField>
);
