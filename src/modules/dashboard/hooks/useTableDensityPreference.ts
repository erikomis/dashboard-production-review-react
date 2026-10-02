import { useLocalStore } from "@/shared/libs/local-store";
import { tableDensityStore } from "@/shared/libs/preferences";

/** Densidade das tabelas (confortável/compacta), salva no navegador e compartilhada entre as telas. */
export const useTableDensityPreference = () => useLocalStore(tableDensityStore);
