
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import Button from '../../components/ui/Button';

interface GenericFormViewProps<T extends Record<string, any>> {
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void;
  renderFields: (form: UseFormReturn<T>) => React.ReactNode;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function GenericFormView<T extends Record<string, any>>({
  defaultValues,
  onSubmit,
  renderFields,
  isLoading,
  onCancel
}: GenericFormViewProps<T>) {
  const form = useForm<T>({
    defaultValues: defaultValues as any,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFields(form)}
        </div>
      </div>
      
      {onCancel && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50 border-t border-slate-100 shrink-0">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button type="submit" isLoading={isLoading} className="min-w-[120px]">
            Lưu dữ liệu
          </Button>
        </div>
      )}
    </form>
  );
}
