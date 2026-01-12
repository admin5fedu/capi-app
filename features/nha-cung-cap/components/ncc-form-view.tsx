
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import { NCCInput } from '../core/types';
import { useNhomNCCList } from '../hooks/use-nha-cung-cap-queries';

interface NCCFormViewProps {
  initialData?: Partial<NCCInput>;
  onSubmit: (data: NCCInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NCCFormView: React.FC<NCCFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { data: groups, isLoading: isGroupsLoading } = useNhomNCCList();

  const renderFields = (form: UseFormReturn<NCCInput>) => {
    const { register, formState: { errors } } = form;
    return (
      <>
        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Tên nhà cung cấp / Người đại diện" 
            required
            placeholder="Nhập tên NCC..." 
            {...register('ten_doi_tac', { required: 'Tên nhà cung cấp là bắt buộc' })} 
            error={errors.ten_doi_tac?.message} 
          />
        </div>

        <Input 
          label="Tên công ty" 
          placeholder="Công ty đối tác..." 
          {...register('cong_ty')} 
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Nhóm nhà cung cấp</label>
          <select 
            {...register('nhom_doi_tac_id', { valueAsNumber: true })}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            disabled={isGroupsLoading}
          >
            <option value="">-- Chọn nhóm NCC --</option>
            {groups?.map(g => (
              <option key={g.id} value={g.id}>{g.ten_nhom}</option>
            ))}
          </select>
        </div>

        <Input 
          label="Số điện thoại" 
          placeholder="0xxxxxxxxx" 
          {...register('so_dien_thoai')} 
        />

        <Input 
          label="Email" 
          type="email"
          placeholder="contact@supplier.com" 
          {...register('email')} 
        />

        <div className="col-span-1 md:col-span-2">
          <Input 
            label="Địa chỉ trụ sở" 
            placeholder="Số nhà, đường, tỉnh thành..." 
            {...register('dia_chi')} 
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5">Ghi chú NCC</label>
            <textarea 
              {...register('thong_tin_khac')}
              placeholder="Nhập các thông tin khác như số tài khoản, chiết khấu đặc biệt..."
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <input type="hidden" {...register('hang_muc')} value="nha_cung_cap" />
      </>
    );
  };

  return (
    <GenericFormView<NCCInput>
      defaultValues={{ hang_muc: 'nha_cung_cap', ...initialData }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default NCCFormView;
