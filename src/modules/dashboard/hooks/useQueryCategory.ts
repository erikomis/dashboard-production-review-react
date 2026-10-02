import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/modules/dashboard/services/category.service";

export const useQueryCategory = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  });

export const useQueryCategoryById = (id?: string) =>
  useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => CategoryService.getById(id!),
    enabled: !!id,
    staleTime: 0,
  });
