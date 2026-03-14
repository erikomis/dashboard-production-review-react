interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center py-4 gap-1">
      <button
        className="px-3 py-1.5 rounded-md border border-stroke text-sm font-medium text-black dark:text-white dark:border-strokedark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-2 dark:hover:bg-meta-4"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-primary border-primary text-white"
              : "border-stroke text-black dark:text-white dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="px-3 py-1.5 rounded-md border border-stroke text-sm font-medium text-black dark:text-white dark:border-strokedark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-2 dark:hover:bg-meta-4"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </button>
    </div>
  );
};
