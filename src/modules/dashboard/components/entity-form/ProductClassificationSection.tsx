import { UseFormRegisterReturn } from "react-hook-form";
import { Category, SubCategory } from "@/shared/types/category";
import { FormSection } from "../form/FormSection";
import { SubCategorySelectField } from "./SubCategorySelectField";

type Props = {
  field: UseFormRegisterReturn;
  subCategories: SubCategory[];
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
};

export const ProductClassificationSection = (props: Props) => (
  <FormSection title="Classificação" description="Onde o produto aparece no catálogo do site.">
    <SubCategorySelectField {...props} />
  </FormSection>
);
