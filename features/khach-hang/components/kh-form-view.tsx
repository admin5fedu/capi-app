
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import { DoiTacInput } from '../core/types';
import { useNhomKhachHangList } from '../hooks/use-khach-hang-queries';

interface KHFormViewProps {
  initialData?: Partial<DoiTacInput>;
  onSubmit: (data: DoiTacInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const KHFormView: React.FC<KHFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { data: groups, isLoading: isGroupsLoading } = useNhomKhachHangList();

  const renderFields = (form: UseFormReturn<DoiTacInput>) => {
    const { register, formState: { errors } } = form;
    return (
      <>
        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Tên khách hàng / Người liên hệ" 
            required
            placeholder="Nhập họ và tên..." 
            {...register('ten_doi_tac', { required: 'Tên khách hàng là bắt buộc' })} 
            error={errors.ten_doi_tac?.message} 
          />
        </div>

        <Input 
          label="Tên công ty" 
          placeholder="Công ty TNHH..." 
          {...register('cong_ty')} 
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Nhóm khách hàng</label>
          <select 
            {...register('nhom_doi_tac_id', { valueAsNumber: true })}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            disabled={isGroupsLoading}
          >
            <option value="">-- Chọn nhóm --</option>
            {groups?.map(g => (
              <option key={g.id} value={g.id}>{g.ten_nhom}</option>
            ))}
          </select>
          {isGroupsLoading && <p className="text-[10px] text-slate-400 animate-pulse">Đang tải nhóm...</p>}
        </div>

        <Input 
          label="Số điện thoại" 
          placeholder="09xx xxx xxx" 
          {...register('so_dien_thoai')} 
        />

        <Input 
          label="Email" 
          type="email"
          placeholder="khachhang@example.com" 
          {...register('email')} 
        />

        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Địa chỉ" 
            placeholder="Số nhà, tên đường, quận/huyện..." 
            {...register('dia_chi')} 
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5">Thông tin khác</label>
            <textarea 
              {...register('thong_tin_khac')}
              placeholder="Ghi chú về sở thích, công nợ hoặc các yêu cầu đặc biệt..."
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <input type="hidden" {...register('hang_muc')} value="khach_hang" />
      </>
    );
  };

  return (
    <GenericFormView<DoiTacInput>
      defaultValues={{ hang_muc: 'khach_hang', ...initialData }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default KHFormView;
