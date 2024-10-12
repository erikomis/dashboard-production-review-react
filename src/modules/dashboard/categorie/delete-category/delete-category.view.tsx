import { Button } from "../../../../shared/components/button";
import { Modal } from "../../../../shared/components/Modal/modal";
import { useDeleteCategoryModel } from "./delete-category.model";

type DeleteCategorieViewProps = ReturnType<typeof useDeleteCategoryModel>;

export const DeleteCategoryView = (props: DeleteCategorieViewProps) => {
  const { onDelete, onClose, open } = props;
  return (
    <Modal title="Deletar Categoria" isOpen={open.open} onClose={onClose}>
      <div className="flex justify-start my-2">
        <p>Tem certeza que deseja deletar a categoria?</p>
      </div>
      <div className="flex items-start justify-center w-full gap-3">
        <Button
          onClick={() => onClose()}
          color="danger"
          size="lg"
          className="text-white"
        >
          Não
        </Button>

        <Button
          color="default"
          size="lg"
          className="flex rounded-lg cursor-pointer borer tra nsition p-4text-white border-primary bg-primary hover:bg-opacity-90"
          onClick={() => onDelete()}
        >
          Sim
        </Button>
      </div>
    </Modal>
  );
};
