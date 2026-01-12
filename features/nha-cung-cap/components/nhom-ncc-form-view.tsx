
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import { NhomNCCInput } from '../core/types';

interface NhomNCCFormViewProps {
  initialData?: Partial<NhomNCCInput>;
  onSubmit: (data: NhomNCCInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NhomNCCFormView: React.FC<NhomNCCFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const renderFields = (form: UseFormReturn<NhomNCCInput>) => {
    const { register, formState: { errors } } = form;
    return (
      <>
        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Tên nhóm nhà cung cấp" 
            required
            placeholder="Ví dụ: NCC Nguyên vật liệu, NCC Văn phòng phẩm..." 
            {...register('ten_nhom', { required: 'Tên nhóm không được để trống' })} 
            error={errors.ten_nhom?.message} 
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5">Mô tả nhóm</label>
            <textarea 
              {...register('mo_ta')}
              placeholder="Nhập ghi chú hoặc mô tả về nhóm NCC này..."
              className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <input type="hidden" {...register('hang_muc')} value="nha_cung_cap" />
      </>
    );
  };

  return (
    <GenericFormView<NhomNCCInput>
      defaultValues={{ hang_muc: 'nha_cung_cap', ...initialData }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default NhomNCCFormView;
