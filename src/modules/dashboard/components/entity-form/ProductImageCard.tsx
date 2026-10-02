import { ImageIcon, ImageUp, Trash2, X } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Badge } from "@/shared/components/badge";
import { IconButton } from "@/shared/components/icon-button";
import { Card } from "../card/Card";

export type ProductImageItem = {
  id: number;
  urlImage: string;
  /** Ex.: "Open Food Facts" (imagem externa) ou o host. */
  sourceLabel: string | null;
  isCover: boolean;
};

type ProductImageCardProps = {
  productName?: string;
  images: ProductImageItem[];
  onDeleteRequest: (image: { id: number; name: string }) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  fileError?: string;
  isUploading: boolean;
  accept: string;
  maxMb: number;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
  onUpload: () => void;
};

export const ProductImageCard = ({
  productName,
  images,
  onDeleteRequest,
  fileInputRef,
  selectedFile,
  fileError,
  isUploading,
  accept,
  maxMb,
  onFileChange,
  clearFile,
  onUpload,
}: ProductImageCardProps) => (
  <Card
    title="Imagens do produto"
    titleId="product-image-title"
    description={
      images.length > 0
        ? `${images.length} ${images.length === 1 ? "imagem cadastrada" : "imagens cadastradas"}. A primeira é usada como capa no site.`
        : "Nenhuma imagem cadastrada ainda."
    }
  >
    {images.length === 0 ? (
      <div className="mb-6 flex h-32 w-full max-w-[10rem] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-stroke bg-gray-2 text-xs text-body dark:border-strokedark dark:bg-meta-4 dark:text-bodydark">
        <ImageIcon size={28} aria-hidden="true" />
        Sem imagem
      </div>
    ) : (
      <ul aria-label="Imagens cadastradas" className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((image, index) => (
          <li
            key={image.id}
            className="group relative overflow-hidden rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-meta-4"
          >
            <div className="aspect-square w-full bg-white">
              <img
                src={image.urlImage}
                alt={`Imagem ${index + 1} de ${productName ?? "produto"}`}
                loading="lazy"
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-stroke px-2 py-1.5 dark:border-strokedark">
              <span className="flex min-w-0 flex-wrap gap-1">
                {image.isCover && <Badge color="primary">Capa</Badge>}
                {image.sourceLabel && (
                  <Badge color="neutral" title={`Origem: ${image.sourceLabel}`}>
                    {image.sourceLabel}
                  </Badge>
                )}
              </span>
              <IconButton
                label={`Excluir imagem ${index + 1}`}
                color="danger"
                onClick={() => onDeleteRequest({ id: image.id, name: `imagem ${index + 1}` })}
                className="h-8 w-8 shrink-0"
              >
                <Trash2 size={16} />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    )}

    <div>
      <label htmlFor="product-image" className="mb-1 block text-sm font-medium text-black dark:text-white">
        Enviar nova imagem
      </label>
      <p id="product-image-hint" className="mb-2 text-xs text-body dark:text-bodydark">
        JPEG, PNG, WEBP ou GIF, até {maxMb} MB.
      </p>
      <input
        ref={fileInputRef}
        id="product-image"
        type="file"
        accept={accept}
        onChange={onFileChange}
        aria-invalid={fileError ? true : undefined}
        aria-describedby={fileError ? "product-image-hint product-image-error" : "product-image-hint"}
        disabled={isUploading}
        className="block w-full max-w-xl cursor-pointer rounded-lg border border-stroke text-sm text-body file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-stroke file:bg-gray-2 file:px-4 file:py-2.5 file:font-medium file:text-black hover:file:bg-stroke dark:border-form-strokedark dark:text-bodydark dark:file:border-form-strokedark dark:file:bg-meta-4 dark:file:text-white"
      />
      {fileError && (
        <p id="product-image-error" className="mt-1.5 text-xs font-medium text-danger dark:text-danger-light">
          {fileError}
        </p>
      )}
      {selectedFile && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="truncate text-sm text-black dark:text-white">
            {selectedFile.name}{" "}
            <span className="text-body dark:text-bodydark">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
          </span>
          <Button size="sm" onClick={onUpload} isLoading={isUploading} leftIcon={<ImageUp size={16} aria-hidden="true" />}>
            {isUploading ? "Enviando..." : "Enviar imagem"}
          </Button>
          <Button size="sm" color="ghost" onClick={clearFile} disabled={isUploading} leftIcon={<X size={16} aria-hidden="true" />}>
            Remover seleção
          </Button>
        </div>
      )}
    </div>
  </Card>
);
