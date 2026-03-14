import { useState } from "react";
import { useMutationDeleteCatetory } from "../../hooks/category/useMutationDeleteCatetory";
import { CategoryService } from "../../services/category.service";
import { toast } from "react-toastify";

export const useDeleteCategoryModel = (
  deleteCategoryService: typeof CategoryService.delete
) => {
  const { mutate } = useMutationDeleteCatetory(deleteCategoryService);
  const [open, setOpen] = useState<{
    open: boolean;
    id: number | null;
  }>({
    open: false,
    id: null,
  });

  const onDeleteCategory = (id: number) => {
    setOpen({
      open: true,
      id,
    });
  };

  const onClose = () => {
    setOpen({
      open: false,
      id: null,
    });
  };
  const onDelete = async () => {
    if (!open.id) {
      return;
    }
    mutate(open.id, {
      onSuccess: () => {
        toast.success("Categoria deletada com sucesso!");
        setOpen({
          open: false,
          id: null,
        });
      },
      onError: () => {
        setOpen({
          open: false,
          id: null,
        });
      },
    });
  };
  return {
    onDelete,
    open,
    onClose,
    onDeleteCategory,
  };
};
