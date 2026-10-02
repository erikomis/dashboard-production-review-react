import { FieldError as RHFFieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Textarea } from "@/shared/components/textarea";
import { FormSection } from "../form/FormSection";
import { SlugField } from "../form/SlugField";

type Errors = {
  name?: RHFFieldError;
  slug?: RHFFieldError;
  description?: RHFFieldError;
};

type CatalogBasicFieldsProps = {
  entityLabel: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  nameField: UseFormRegisterReturn;
  slugField: UseFormRegisterReturn;
  descriptionField: UseFormRegisterReturn;
  regenerateSlug: () => void;
  errors: Errors;
  descriptionMax?: number;
  descriptionRows?: number;
};

/** Seções "Identificação" (nome + slug) e "Descrição", comuns a categoria, subcategoria e produto. */
export const CatalogBasicFields = ({
  entityLabel,
  namePlaceholder,
  descriptionPlaceholder,
  nameField,
  slugField,
  descriptionField,
  regenerateSlug,
  errors,
  descriptionMax = 255,
  descriptionRows = 3,
}: CatalogBasicFieldsProps) => (
  <>
    <FormSection
      title="Identificação"
      description={`Nome exibido no site e o endereço amigável (slug) da ${entityLabel}.`}
    >
      <Input
        id="name"
        placeholder={namePlaceholder}
        autoComplete="off"
        error={errors.name?.message}
        aria-required="true"
        {...nameField}
      >
        <Label value="Nome" htmlFor="name" required />
      </Input>
      <SlugField field={slugField} error={errors.slug?.message} onRegenerate={regenerateSlug} />
    </FormSection>

    <FormSection title="Descrição" description="Texto curto que ajuda a identificar o conteúdo.">
      <Textarea
        id="description"
        rows={descriptionRows}
        placeholder={descriptionPlaceholder}
        error={errors.description?.message}
        hint={`Até ${descriptionMax} caracteres.`}
        aria-required="true"
        {...descriptionField}
      >
        <Label value="Descrição" htmlFor="description" required />
      </Textarea>
    </FormSection>
  </>
);
