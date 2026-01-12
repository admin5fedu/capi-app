
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import { NhomDoiTacInput } from '../core/types';

interface NhomKHFormViewProps {
  initialData?: Partial<NhomDoiTacInput>;
  onSubmit: (data: NhomDoiTacInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NhomKHFormView: React.FC<NhomKHFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const renderFields = (form: UseFormReturn<NhomDoiTacInput>) => {
    const { register, formState: { errors } } = form;
    return (
      <>
        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Tên nhóm khách hàng" 
            required
            placeholder="Ví dụ: Khách hàng VIP, Đại lý miền Bắc..." 
            {...register('ten_nhom', { required: 'Tên nhóm không được để trống' })} 
            error={errors.ten_nhom?.message} 
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5">Mô tả nhóm</label>
            <textarea 
              {...register('mo_ta')}
              placeholder="Nhập mô tả chi tiết về nhóm khách hàng này..."
              className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        {/* Hidden field for hang_muc */}
        <input type="hidden" {...register('hang_muc')} value="khach_hang" />
      </>
    );
  };

  return (
    <GenericFormView<NhomDoiTacInput>
      defaultValues={{ hang_muc: 'khach_hang', ...initialData }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default NhomKHFormView;
