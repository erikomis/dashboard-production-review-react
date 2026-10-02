import { Link } from "react-router-dom";
import { FieldError as RHFFieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Textarea } from "@/shared/components/textarea";
import { SelectField } from "@/shared/components/select-field";
import { StarRatingInput } from "@/shared/components/star-rating";
import { Product } from "@/shared/types/product";
import { FormSection } from "../form/FormSection";

type ReviewFormFieldsProps = {
  titleField: UseFormRegisterReturn;
  descriptionField: UseFormRegisterReturn;
  productField: UseFormRegisterReturn;
  note: number;
  setNote: (value: number) => void;
  errors: {
    title?: RHFFieldError;
    description?: RHFFieldError;
    note?: RHFFieldError;
    productId?: RHFFieldError;
  };
  productOptions: {
    products: Product[];
    isTruncated: boolean;
    isLoading: boolean;
    isError: boolean;
  };
};

export const ReviewFormFields = ({
  titleField,
  descriptionField,
  productField,
  note,
  setNote,
  errors,
  productOptions,
}: ReviewFormFieldsProps) => (
  <>
    <FormSection title="Produto" description="Qual produto está sendo avaliado.">
      <SelectField
        id="productId"
        label={<Label value="Produto" htmlFor="productId" required />}
        error={
          errors.productId?.message ??
          (productOptions.isError ? "Não foi possível carregar os produtos." : undefined)
        }
        disabled={productOptions.isLoading || productOptions.isError}
        aria-required="true"
        hint={
          !productOptions.isLoading && productOptions.products.length === 0 ? (
            <>
              Nenhum produto cadastrado.{" "}
              <Link to="/dashboard/products/add" className="font-medium text-primary underline dark:text-primary-light">
                Criar produto
              </Link>
            </>
          ) : productOptions.isTruncated ? (
            "Mostrando os 100 primeiros produtos em ordem alfabética."
          ) : undefined
        }
        {...productField}
      >
        <option value="">{productOptions.isLoading ? "Carregando produtos..." : "Selecione um produto"}</option>
        {productOptions.products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </SelectField>
    </FormSection>

    <FormSection title="Avaliação" description="Nota de 1 a 5 estrelas, título e comentário.">
      <StarRatingInput
        name="note"
        legend="Nota"
        value={note}
        onChange={setNote}
        error={errors.note?.message}
      />
      <Input
        id="title"
        placeholder="Ex.: Ótimo custo-benefício"
        autoComplete="off"
        error={errors.title?.message}
        aria-required="true"
        {...titleField}
      >
        <Label value="Título" htmlFor="title" required />
      </Input>
      <Textarea
        id="description"
        rows={5}
        placeholder="Conte como foi a experiência com o produto..."
        error={errors.description?.message}
        hint="Entre 3 e 255 caracteres."
        aria-required="true"
        {...descriptionField}
      >
        <Label value="Comentário" htmlFor="description" required />
      </Textarea>
    </FormSection>
  </>
);
