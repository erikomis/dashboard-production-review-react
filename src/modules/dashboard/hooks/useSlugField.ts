import { useCallback, useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { slugify } from "@/shared/utils/slugify";

type WithSlug = FieldValues & { name: string; slug: string };

/**
 * Mantém o `slug` gerado a partir do `name` enquanto o usuário não editar o
 * slug manualmente. Depois de editado, para de sincronizar (até "Gerar a partir do nome").
 */
export const useSlugField = <T extends WithSlug>(form: UseFormReturn<T>) => {
  const { register, setValue, getValues } = form;
  const [slugEdited, setSlugEdited] = useState(false);
  const nameKey = "name" as Path<T>;
  const slugKey = "slug" as Path<T>;
  const { isSubmitted } = form.formState;

  const applySlug = (value: string) =>
    setValue(slugKey, value as PathValue<T, Path<T>>, {
      shouldValidate: isSubmitted,
      shouldDirty: true,
    });

  const nameField = register(nameKey, {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!slugEdited) applySlug(slugify(event.target.value));
    },
  });

  const slugField = register(slugKey, {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      // Campo esvaziado volta a acompanhar o nome
      setSlugEdited(event.target.value.trim() !== "");
    },
  });

  /** Regera o slug a partir do nome atual e volta a sincronizar. */
  const regenerateSlug = () => {
    setSlugEdited(false);
    applySlug(slugify(String(getValues(nameKey) ?? "")));
  };

  /** Edição, após `reset`: se o slug salvo difere do gerado pelo nome, não sobrescreve. */
  const syncSlugEdited = useCallback((name: string, slug: string) => {
    setSlugEdited(slug !== slugify(name));
  }, []);

  return { nameField, slugField, regenerateSlug, syncSlugEdited };
};
