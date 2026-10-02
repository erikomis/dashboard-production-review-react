import { ImageIcon, ImageUp, X } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Card } from "../card/Card";

type ProductImageCardProps = {
  productName?: string;
  imageUrl: string | null;
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
  imageUrl,
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
    title="Imagem do produto"
    titleId="product-image-title"
    description={`JPEG, PNG, WEBP ou GIF, até ${maxMb} MB.`}
  >
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="flex aspect-square w-full max-w-[10rem] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
        {imageUrl ? (
          <img src={imageUrl} alt={`Imagem atual de ${productName ?? "produto"}`} className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 p-4 text-center text-xs text-body dark:text-bodydark">
            <ImageIcon size={28} aria-hidden="true" />
            Sem imagem
          </span>
        )}
      </div>

      <div className="flex-1">
        <label htmlFor="product-image" className="mb-2 block text-sm font-medium text-black dark:text-white">
          Enviar nova imagem
        </label>
        <input
          ref={fileInputRef}
          id="product-image"
          type="file"
          accept={accept}
          onChange={onFileChange}
          aria-invalid={fileError ? true : undefined}
          aria-describedby={fileError ? "product-image-error" : undefined}
          disabled={isUploading}
          className="block w-full cursor-pointer rounded-lg border border-stroke text-sm text-body file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-stroke file:bg-gray-2 file:px-4 file:py-2.5 file:font-medium file:text-black hover:file:bg-stroke dark:border-form-strokedark dark:text-bodydark dark:file:border-form-strokedark dark:file:bg-meta-4 dark:file:text-white"
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
            <Button
              size="sm"
              onClick={onUpload}
              isLoading={isUploading}
              leftIcon={<ImageUp size={16} aria-hidden="true" />}
            >
              {isUploading ? "Enviando..." : "Enviar imagem"}
            </Button>
            <Button size="sm" color="ghost" onClick={clearFile} disabled={isUploading} leftIcon={<X size={16} aria-hidden="true" />}>
              Remover seleção
            </Button>
          </div>
        )}
      </div>
    </div>
  </Card>
);
