
import React from 'react';
import Button from '../ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, title, message, onConfirm, onCancel, isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>Hủy</Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
