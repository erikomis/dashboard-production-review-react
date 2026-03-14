import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "../../services/category.service";

export const useQueryCategory = () => useQuery({
  queryKey: ["categories"],
  queryFn: () => CategoryService.list(),
});