
import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import NumberInput from '../../../components/ui/NumberInput';
import { TyGiaInput } from '../core/types';

interface TyGiaFormViewProps {
  initialData?: Partial<TyGiaInput>;
  onSubmit: (data: TyGiaInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TyGiaFormView: React.FC<TyGiaFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const renderFields = (form: UseFormReturn<TyGiaInput>) => {
    const { formState: { errors }, control } = form;
    return (
      <div className="col-span-1 md:col-span-2">
        <Controller
          name="ty_gia"
          control={control}
          rules={{ 
            required: 'Tỷ giá không được để trống',
            min: { value: 1, message: 'Tỷ giá phải là một số dương' }
          }}
          render={({ field }) => (
            <NumberInput
              label="Tỷ giá mới (USD/VND)"
              required
              placeholder="Ví dụ: 25450"
              value={field.value}
              onChange={field.onChange}
              error={errors.ty_gia?.message}
            />
          )}
        />
      </div>
    );
  };
  
  const MyGenericFormView = GenericFormView<TyGiaInput>;

  return (
    <MyGenericFormView
      defaultValues={initialData}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default TyGiaFormView;
