import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryProductById } from "@/modules/dashboard/hooks/useQueryProducts";
import {
  useMutationDeleteProductImage,
  useMutationUpdateProduct,
  useMutationUploadProductImage,
} from "@/modules/dashboard/hooks/useMutationProduct";
import { useDeleteDialog } from "@/modules/dashboard/hooks/useDeleteDialog";
import { getImageSourceLabel } from "@/modules/dashboard/utils/product-sort";
import { useSlugField } from "@/modules/dashboard/hooks/useSlugField";
import { useSubCategoryOptions } from "@/modules/dashboard/hooks/useSubCategoryOptions";
import { queryClient } from "@/shared/libs/react-query";
import { getErrorMessage, getErrorStatus } from "@/shared/utils/error-message";
import { SchemaEditProduct } from "./edit-product.schema";
import { EditProductValues } from "./edit-product.type";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_MB = 10;

export const useEditProductModel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: updateProduct, isPending } = useMutationUpdateProduct();
  const { mutateAsync: uploadImage, isPending: isUploading } = useMutationUploadProductImage();
  const { mutateAsync: deleteImage } = useMutationDeleteProductImage();
  const { data, isLoading, isError, error, refetch } = useQueryProductById(id);
  const options = useSubCategoryOptions();

  const form = useForm<EditProductValues>({
    resolver: zodResolver(SchemaEditProduct),
    defaultValues: { name: "", slug: "", description: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;
  const { nameField, slugField, regenerateSlug, syncSlugEdited } = useSlugField(form);

  useEffect(() => {
    if (data && options.isReady) {
      reset({
        name: data.name,
        slug: data.slug ?? "",
        description: data.description ?? "",
        subCategorieId: data.subCategorieId,
      });
      syncSlugEdited(data.name, data.slug ?? "");
    }
  }, [data, options.isReady, reset, syncSlugEdited]);

  const onSubmit: SubmitHandler<EditProductValues> = async (formData) => {
    try {
      await updateProduct({ id: id!, ...formData });
      toast.success("Produto atualizado com sucesso!");
      navigate("/dashboard/products");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao atualizar produto. Tente novamente."));
    }
  };

  // ---- Upload de imagem (POST /production/file) ----
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFileError(undefined);
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError("Formato não suportado. Envie JPEG, PNG, WEBP ou GIF.");
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setFileError(`A imagem deve ter no máximo ${MAX_IMAGE_MB} MB.`);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileError(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onUpload = async () => {
    if (!selectedFile || !id) return;
    try {
      await uploadImage({ productId: id, file: selectedFile });
      toast.success("Imagem enviada com sucesso!");
      clearFile();
      await queryClient.invalidateQueries({ queryKey: ["products", "detail", id] });
    } catch (err) {
      // Localmente o MinIO não roda: a API responde 500. Só informa, sem quebrar a tela.
      toast.error(getErrorMessage(err, "Não foi possível enviar a imagem."));
    }
  };

  // ---- Exclusão de imagem (DELETE /production/file/{id}) ----
  const imageDialog = useDeleteDialog({
    remove: (imageId) => deleteImage(imageId),
    successMessage: "Imagem excluída com sucesso!",
    errorFallback: "Não foi possível excluir a imagem.",
  });

  const images = (data?.images ?? []).map((image) => ({
    id: image.id,
    urlImage: image.urlImage,
    sourceLabel: getImageSourceLabel(image.urlImage),
    isCover: image.urlImage === data?.imageUrl,
  }));

  const loadError = isError
    ? getErrorStatus(error) === 404
      ? { title: "Produto não encontrado", description: "Ele pode ter sido excluído." }
      : {
          title: "Erro ao carregar o produto",
          description: getErrorMessage(error),
          onRetry: () => void refetch(),
        }
    : null;

  return {
    productName: data?.name,
    images,
    imageDelete: {
      target: imageDialog.deleteTarget,
      isDeleting: imageDialog.isDeleting,
      request: imageDialog.handleDeleteRequest,
      cancel: imageDialog.handleDeleteCancel,
      confirm: imageDialog.handleDeleteConfirm,
    },
    reviewsLink: id ? `/dashboard/review?product=${id}` : undefined,
    averageNote: data?.averageNote ?? null,
    totalReviews: data?.totalReviews ?? 0,
    nameField,
    slugField,
    descriptionField: register("description"),
    subCategoryField: register("subCategorieId"),
    regenerateSlug,
    errors,
    isPending,
    isLoading: isLoading || options.isLoading,
    loadError,
    options,
    onSubmit: handleSubmit(onSubmit),
    onCancel: () => navigate("/dashboard/products"),
    upload: {
      fileInputRef,
      selectedFile,
      fileError,
      isUploading,
      accept: ACCEPTED_IMAGE_TYPES.join(","),
      maxMb: MAX_IMAGE_MB,
      onFileChange,
      clearFile,
      onUpload,
    },
  };
};
