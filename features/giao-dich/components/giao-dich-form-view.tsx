
import React, { useMemo, useEffect } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { GenericFormView } from '../../../shared/components/GenericFormView';
import Input from '../../../components/ui/Input';
import NumberInput from '../../../components/ui/NumberInput';
import { GiaoDichInput, HangMucGiaoDich } from '../core/types';
import { useDanhMucTaiChinhList } from '../../danh-muc-tai-chinh/hooks/use-danh-muc-tai-chinh-queries';
import { useTaiKhoanList } from '../../tai-khoan/hooks/use-tai-khoan-queries';
import { useTyGiaList } from '../../ty-gia/hooks/use-ty-gia-queries';
import { useKhachHangList } from '../../khach-hang/hooks/use-khach-hang-queries';
import { useNCCList } from '../../nha-cung-cap/hooks/use-nha-cung-cap-queries';
import { Repeat, Info } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/format';
import { cn } from '../../../lib/utils';

interface GiaoDichFormViewProps {
  initialData?: Partial<GiaoDichInput>;
  onSubmit: (data: GiaoDichInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const GiaoDichFormView: React.FC<GiaoDichFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  
  const { data: danhMucList, isLoading: isDMLoading } = useDanhMucTaiChinhList();
  const { data: taiKhoanList, isLoading: isTKLoading } = useTaiKhoanList();
  const { data: tyGiaList } = useTyGiaList();
  const { data: khachHangList, isLoading: isKHLoading } = useKhachHangList();
  const { data: nccList, isLoading: isNCCLoading } = useNCCList();

  const renderFields = (form: UseFormReturn<GiaoDichInput>) => {
    const { register, watch, formState: { errors }, control, setValue } = form;

    const hangMuc = watch('hang_muc');
    const taiKhoanDiId = watch('tai_khoan_di_id');
    const taiKhoanDenId = watch('tai_khoan_den_id');
    const soTien = watch('so_tien');
    const soTyGia = watch('so_ty_gia');

    const filteredDanhMuc = useMemo(() => {
        return danhMucList?.filter(dm => dm.hang_muc === hangMuc) || [];
    }, [danhMucList, hangMuc]);
    
    const doiTacList = hangMuc === 'thu' ? khachHangList : nccList;
    const isDoiTacLoading = hangMuc === 'thu' ? isKHLoading : isNCCLoading;

    const tkDi = useMemo(() => taiKhoanList?.find(tk => tk.id === taiKhoanDiId), [taiKhoanList, taiKhoanDiId]);
    const tkDen = useMemo(() => taiKhoanList?.find(tk => tk.id === taiKhoanDenId), [taiKhoanList, taiKhoanDenId]);

    const isNgoaiTe = useMemo(() => {
        if (hangMuc === 'chi') return tkDi?.don_vi === 'USD';
        if (hangMuc === 'thu') return tkDen?.don_vi === 'USD';
        if (hangMuc === 'chuyen_tien') return tkDi?.don_vi === 'USD' || tkDen?.don_vi === 'USD';
        return false;
    }, [hangMuc, tkDi, tkDen]);
    
    useEffect(() => {
      const latestRate = tyGiaList?.[0];
      const currentRate = watch('so_ty_gia');
      
      if (isNgoaiTe) {
        if ((!initialData || initialData.so_ty_gia === 1) && latestRate && (!currentRate || currentRate === 1)) {
           setValue('so_ty_gia', latestRate.ty_gia);
        }
      } else {
        if (currentRate !== 1) {
            setValue('so_ty_gia', 1);
        }
      }
    }, [isNgoaiTe, tyGiaList, setValue, initialData, watch]);

    const soTienQuyDoi = (soTien || 0) * (soTyGia || 1);

    return (
      <>
        <Input 
            label="Ngày giao dịch" 
            type="date"
            required
            {...register('ngay', { required: 'Ngày là bắt buộc' })} 
            error={errors.ngay?.message} 
        />
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 ml-0.5">Hạng mục</label>
          <select {...register('hang_muc')} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="chi">Chi tiền</option>
            <option value="thu">Thu tiền</option>
            <option value="chuyen_tien">Chuyển tiền nội bộ</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
            <Input 
                label="Mô tả giao dịch" 
                required
                placeholder="Ví dụ: Thanh toán tiền điện tháng 12..." 
                {...register('mo_ta', { required: 'Mô tả là bắt buộc' })} 
                error={errors.mo_ta?.message} 
            />
        </div>
        
        <Controller
          name="so_tien"
          control={control}
          rules={{ required: 'Số tiền là bắt buộc', min: { value: 1, message: 'Số tiền phải lớn hơn 0' } }}
          render={({ field }) => (
            <NumberInput
              label="Số tiền"
              required
              placeholder="0"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={errors.so_tien?.message}
            />
          )}
        />

        {hangMuc !== 'chuyen_tien' && (
          <>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Đối tác</label>
                <select {...register('doi_tac_id', { setValueAs: v => v ? Number(v) : null })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={isDoiTacLoading}>
                    <option value="">-- {hangMuc === 'thu' ? 'Chọn khách hàng' : 'Chọn nhà cung cấp'} --</option>
                    {doiTacList?.map(dt => <option key={dt.id} value={dt.id}>{dt.ten_doi_tac}</option>)}
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Danh mục</label>
                <select {...register('danh_muc_id', { valueAsNumber: true })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={isDMLoading}>
                    <option value="">-- Chọn danh mục --</option>
                    {filteredDanhMuc.filter(d => d.cap === 1).map(parent => (
                        <optgroup key={parent.id} label={parent.ten_danh_muc || ''}>
                            {filteredDanhMuc.filter(child => child.danh_muc_cha_id === parent.id).map(child => (
                                <option key={child.id} value={child.id}>{child.ten_danh_muc}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
          </>
        )}

        { (hangMuc === 'chi' || hangMuc === 'chuyen_tien') && (
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Từ tài khoản</label>
                <select {...register('tai_khoan_di_id', { setValueAs: (v) => (v ? parseInt(v, 10) : null) })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={isTKLoading}>
                    <option value="">-- Chọn tài khoản đi --</option>
                    {taiKhoanList?.map(tk => <option key={tk.id} value={tk.id}>{tk.ten_tai_khoan} ({tk.don_vi})</option>)}
                </select>
            </div>
        )}

        { (hangMuc === 'thu' || hangMuc === 'chuyen_tien') && (
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Vào tài khoản</label>
                <select {...register('tai_khoan_den_id', { setValueAs: (v) => (v ? parseInt(v, 10) : null) })} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={isTKLoading}>
                    <option value="">-- Chọn tài khoản đến --</option>
                    {taiKhoanList?.map(tk => <option key={tk.id} value={tk.id}>{tk.ten_tai_khoan} ({tk.don_vi})</option>)}
                </select>
            </div>
        )}
        
        <div className={cn("col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4", isNgoaiTe ? 'animate-in fade-in' : 'hidden')}>
            <Controller
                name="so_ty_gia"
                control={control}
                rules={{ required: 'Tỷ giá là bắt buộc' }}
                render={({ field }) => (
                <NumberInput
                    label="Tỷ giá áp dụng"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.so_ty_gia?.message}
                    disabled={!isNgoaiTe}
                />
                )}
            />
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm"><Repeat size={16}/></div>
                <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Số tiền quy đổi (VND)</p>
                <p className="font-bold text-slate-700">{formatCurrency(soTienQuyDoi)}</p>
                </div>
            </div>
        </div>
          
        <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100"></div>

        <div className="col-span-1 md:col-span-2">
            <Input 
                label="Chứng từ (Nếu có)" 
                placeholder="Ví dụ: Hóa đơn #HD123, Phiếu chi #PC004" 
                {...register('chung_tu')} 
            />
        </div>

        <div className="col-span-1 md:col-span-2">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-0.5">Ghi chú</label>
                <textarea 
                    {...register('ghi_chu')}
                    placeholder="Nhập ghi chú thêm cho giao dịch này..."
                    className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>
        </div>

        {isNgoaiTe && (!soTyGia || soTyGia === 1) && (
          <div className="col-span-1 md:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
            <Info size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">Giao dịch đang liên quan đến ngoại tệ (USD). Vui lòng nhập hoặc xác nhận tỷ giá để hệ thống tự động quy đổi và ghi nhận giá trị chính xác.</p>
          </div>
        )}
      </>
    );
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  const MyGenericFormView = GenericFormView<GiaoDichInput>;

  return (
    <MyGenericFormView
      defaultValues={{ 
        ngay: today,
        hang_muc: 'chi' as HangMucGiaoDich,
        so_tien: 0,
        so_ty_gia: 1,
        ...initialData,
      }}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default GiaoDichFormView;