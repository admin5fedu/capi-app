
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../../shared/components/GenericFormView';
import Input from '../../../../components/ui/Input';
import { VaiTroInput } from '../core/types';

interface VaiTroFormViewProps {
  initialData?: Partial<VaiTroInput>;
  onSubmit: (data: VaiTroInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VaiTroFormView: React.FC<VaiTroFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const renderFields = (form: UseFormReturn<VaiTroInput>) => {
    const { register, formState: { errors } } = form;
    return (
      <div className="col-span-1 md:col-span-2">
        <Input 
          label="Tên vai trò" 
          required
          placeholder="Ví dụ: Giám đốc kinh doanh, Kỹ thuật viên..." 
          {...register('ten_vai_tro', { required: 'Tên vai trò không được để trống' })} 
          error={errors.ten_vai_tro?.message} 
        />
      </div>
    );
  };

  return (
    <GenericFormView<VaiTroInput>
      defaultValues={initialData}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default VaiTroFormView;
