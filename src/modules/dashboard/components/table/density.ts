import { createContext, useContext } from "react";
import { TableDensity } from "@/shared/libs/preferences";

export const TableDensityContext = createContext<TableDensity>("comfortable");
export const useTableDensity = () => useContext(TableDensityContext);
