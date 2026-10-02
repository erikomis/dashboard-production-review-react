import { z } from "zod";
import { importCatalogSchema } from "./import-catalog.schema";

export type ImportCatalogValues = z.infer<typeof importCatalogSchema>;

export type TaxonomyCategory = {
  name: string;
  slug: string;
  subCategories: { name: string; slug: string; tag: string }[];
};

/** Taxonomia fixa importada do Open Food Facts (nomes em PT; tag OFF à direita). */
export const IMPORT_TAXONOMY: TaxonomyCategory[] = [
  {
    name: "Bebidas",
    slug: "bebidas",
    subCategories: [
      { name: "Refrigerantes", slug: "refrigerantes", tag: "sodas" },
      { name: "Sucos e néctares", slug: "sucos-e-nectares", tag: "fruit-juices" },
      { name: "Cafés", slug: "cafes", tag: "coffees" },
    ],
  },
  {
    name: "Laticínios",
    slug: "laticinios",
    subCategories: [
      { name: "Leites", slug: "leites", tag: "milks" },
      { name: "Iogurtes", slug: "iogurtes", tag: "yogurts" },
      { name: "Queijos", slug: "queijos", tag: "cheeses" },
    ],
  },
  {
    name: "Café da manhã",
    slug: "cafe-da-manha",
    subCategories: [
      { name: "Cereais matinais", slug: "cereais-matinais", tag: "breakfast-cereals" },
      { name: "Biscoitos", slug: "biscoitos", tag: "biscuits" },
      { name: "Pães", slug: "paes", tag: "breads" },
    ],
  },
  {
    name: "Doces e snacks",
    slug: "doces-e-snacks",
    subCategories: [
      { name: "Chocolates", slug: "chocolates", tag: "chocolates" },
      { name: "Salgadinhos", slug: "salgadinhos", tag: "crisps" },
      { name: "Sorvetes", slug: "sorvetes", tag: "ice-creams" },
    ],
  },
];

export const IMPORT_STEPS = IMPORT_TAXONOMY.reduce((acc, c) => acc + c.subCategories.length, 0);
