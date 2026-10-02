/** Metadados de paginação devolvidos pela API (ficam em `page`, não na raiz). */
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

/** Envelope padrão de qualquer endpoint paginado. Paginação 0-based. */
export interface Page<T> {
  content: T[];
  page: PageInfo;
}

/** Corpo de erro padrão do backend. */
export interface ApiErrorBody {
  message: string;
  httpStatus?: string;
  statusCode?: number;
}
