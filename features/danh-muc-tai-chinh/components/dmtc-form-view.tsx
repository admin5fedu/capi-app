
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import { DanhMucTaiChinhInput, DanhMucTaiChinh } from '../core/types';

interface DMTCFormViewProps {
  initialData?: Partial<DanhMucTaiChinhInput>;
  danhMucList: DanhMucTaiChinh[] | undefined;
  onSubmit: (data: DanhMucTaiChinhInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DMTCFormView: React.FC<DMTCFormViewProps> = ({ initialData, danhMucList, onSubmit, onCancel, isLoading }) => {

  const parentOptions = React.useMemo(() => {
    return danhMucList?.filter(item => item.cap === 1) || [];
  }, [danhMucList]);

  const renderFields = (form: UseFormReturn<DanhMucTaiChinhInput>) => {
    const { register, formState: { errors } } = form;
    return (
      <>
        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Tên danh mục" 
            required
            placeholder="Ví dụ: Chi phí nhân sự, Thu từ kinh doanh..." 
            {...register('ten_danh_muc', { required: 'Tên danh mục không được để trống' })} 
            error={errors.ten_danh_muc?.message} 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Hạng mục</label>
          <select 
            {...register('hang_muc')}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="chi">Hạng mục Chi</option>
            <option value="thu">Hạng mục Thu</option>
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Danh mục cha (nếu có)</label>
          <select 
            {...register('danh_muc_cha_id', { 
              setValueAs: (value) => (value ? Number(value) : null) 
            })}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">-- Là danh mục gốc --</option>
            {parentOptions.map(item => (
              <option key={item.id} value={item.id}>{item.ten_danh_muc}</option>
            ))}
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5">Mô tả</label>
            <textarea 
              {...register('mo_ta')}
              placeholder="Nhập mô tả chi tiết để làm rõ ý nghĩa của danh mục này..."
              className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <GenericFormView<DanhMucTaiChinhInput>
      defaultValues={{ hang_muc: 'chi', ...initialData }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default DMTCFormView;
