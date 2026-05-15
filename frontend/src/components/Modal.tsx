import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Xác nhận",
  cancelText = "Đóng",
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Header gradient đẹp */}
        <div className="bg-linear-to-r from-purple-600 to-violet-600 px-6 py-6 text-white">
          <h3 className="text-2xl font-bold text-center tracking-tight">{title}</h3>
        </div>

        {/* Nội dung */}
        <div className="p-8 text-center text-gray-700 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="flex border-t">
          <button
            onClick={onClose}
            className="flex-1 py-5 text-lg font-medium text-gray-500 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 py-5 text-lg font-semibold text-white bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 transition"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;