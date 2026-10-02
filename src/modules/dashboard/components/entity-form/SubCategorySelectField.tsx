import { Link } from "react-router-dom";
import { UseFormRegisterReturn } from "react-hook-form";
import { SelectField } from "@/shared/components/select-field";
import { Label } from "@/shared/components/label";
import { Category, SubCategory } from "@/shared/types/category";

type Props = {
  field: UseFormRegisterReturn;
  subCategories: SubCategory[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
};

/**
 * Select de subcategoria (`/sub-categorie/list`), agrupado por categoria
 * com `<optgroup>` usando os nomes de `/category/list`.
 */
export const SubCategorySelectField = ({
  field,
  subCategories,
  categories,
  isLoading,
  isError,
  error,
}: Props) => {
  const names = new Map(categories.map((c) => [c.id, c.name]));
  const groups = new Map<number, SubCategory[]>();
  subCategories.forEach((sub) => {
    groups.set(sub.categorieId, [...(groups.get(sub.categorieId) ?? []), sub]);
  });
  const sortedGroups = [...groups.entries()].sort(([a], [b]) =>
    (names.get(a) ?? "").localeCompare(names.get(b) ?? "", "pt-BR")
  );

  return (
    <SelectField
      id="subCategorieId"
      label={<Label value="Subcategoria" htmlFor="subCategorieId" required />}
      error={error ?? (isError ? "Não foi possível carregar as subcategorias." : undefined)}
      disabled={isLoading || isError}
      aria-required="true"
      hint={
        !isLoading && !isError && subCategories.length === 0 ? (
          <>
            Nenhuma subcategoria cadastrada.{" "}
            <Link to="/dashboard/sub-categories/add" className="font-medium text-primary underline dark:text-primary-light">
              Criar subcategoria
            </Link>
          </>
        ) : (
          "As opções estão agrupadas pela categoria."
        )
      }
      {...field}
    >
      <option value="">{isLoading ? "Carregando subcategorias..." : "Selecione uma subcategoria"}</option>
      {sortedGroups.map(([categoryId, subs]) => (
        <optgroup key={categoryId} label={names.get(categoryId) ?? `Categoria #${categoryId}`}>
          {subs.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </optgroup>
      ))}
    </SelectField>
  );
};
