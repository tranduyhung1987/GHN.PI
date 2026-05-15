import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Xác nhận",
  cancelText = "Đóng",
  onConfirm,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const width = size === 'lg' ? 'max-w-lg' : size === 'sm' ? 'max-w-sm' : 'max-w-md';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl w-full ${width} overflow-hidden shadow-2xl`}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <h3 className="text-2xl font-bold text-purple-700 text-center">{title}</h3>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-700">
          {children}
        </div>

        {/* Footer */}
        <div className="flex border-t">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 py-4 bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
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