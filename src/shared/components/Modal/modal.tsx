

type ModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};
export const Modal = ({ title, children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center block w-full h-full px-4 py-5 z-999999 bg-black/90">
      <div className="w-full max-w-142.5 rounded-lg bg-white px-8 py-4 text-center dark:bg-boxdark md:px-4 md:py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-white"
          >
            X
          </button>
        </div>

        <div className="mb-4">{children}</div>
    
      </div>
    </div>
  );
};
