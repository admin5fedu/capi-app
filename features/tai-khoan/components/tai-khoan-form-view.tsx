import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import NumberInput from '../../../components/ui/NumberInput';
import { TaiKhoanInput } from '../core/types';

interface TaiKhoanFormViewProps {
  initialData?: Partial<TaiKhoanInput>;
  onSubmit: (data: TaiKhoanInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaiKhoanFormView: React.FC<TaiKhoanFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const renderFields = (form: UseFormReturn<TaiKhoanInput>) => {
    const { register, watch, formState: { errors }, control } = form;
    const loaiTaiKhoan = watch('loai_tai_khoan');

    return (
      <>
        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Tên tài khoản / Tên quỹ" 
            required
            placeholder="Ví dụ: Tiền mặt văn phòng, MB Bank Business..." 
            {...register('ten_tai_khoan', { required: 'Tên tài khoản là bắt buộc' })} 
            error={errors.ten_tai_khoan?.message} 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Loại tài khoản</label>
          <select 
            {...register('loai_tai_khoan')}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="tien_mat">Tiền mặt / Quỹ nội bộ</option>
            <option value="tai_khoan">Tài khoản Ngân hàng</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Đơn vị tiền tệ</label>
          <select 
            {...register('don_vi')}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="VND">Việt Nam Đồng (VND)</option>
            <option value="USD">Đô la Mỹ (USD)</option>
          </select>
        </div>
        
        {loaiTaiKhoan === 'tai_khoan' && (
          <>
            <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin ngân hàng</p>
            </div>
            <Input 
              label="Ngân hàng" 
              placeholder="Ví dụ: Vietcombank, Techcombank..." 
              {...register('ngan_hang')} 
            />
            <Input 
              label="Số tài khoản" 
              placeholder="Nhập số tài khoản..." 
              {...register('so_tai_khoan')} 
            />
            <div className="col-span-1 md:col-span-2">
              <Input 
                label="Chủ tài khoản" 
                placeholder="Tên chủ tài khoản ngân hàng..." 
                {...register('chu_tai_khoan')} 
              />
            </div>
          </>
        )}

        <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100"></div>

        <Controller
          name="so_du_dau_ky"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Số dư đầu kỳ"
              placeholder="0"
              value={field.value}
              onChange={field.onChange}
              error={errors.so_du_dau_ky?.message}
            />
          )}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Trạng thái</label>
          <select 
            {...register('trang_thai')}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="hoat_dong">Đang hoạt động</option>
            <option value="ngung_hoat_dong">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5">Ghi chú</label>
            <textarea 
              {...register('ghi_chu')}
              placeholder="Thông tin thêm về tài khoản này..."
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </>
    );
  };
  
  const MyGenericFormView = GenericFormView<TaiKhoanInput>;

  return (
    <MyGenericFormView
      defaultValues={{ 
        loai_tai_khoan: 'tien_mat', 
        don_vi: 'VND', 
        trang_thai: 'hoat_dong', 
        so_du_dau_ky: 0,
        ...initialData 
      }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default TaiKhoanFormView;