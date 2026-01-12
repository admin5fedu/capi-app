
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GenericFormView } from '../../../../shared/components/GenericFormView';
import Input from '../../../../components/ui/Input';
import { NhanVienInput } from '../core/types';
import { useVaiTroList } from '../../vai-tro/hooks/use-vai-tro-queries';
import { Camera } from 'lucide-react';

interface NhanVienFormViewProps {
  initialData?: Partial<NhanVienInput>;
  onSubmit: (data: NhanVienInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NhanVienFormView: React.FC<NhanVienFormViewProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { data: roles, isLoading: isRolesLoading } = useVaiTroList();

  const renderFields = (form: UseFormReturn<NhanVienInput>) => {
    const { register, formState: { errors }, watch } = form;
    const avatarFile = watch('avatarFile');
    const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar || null);

    useEffect(() => {
      if (avatarFile && avatarFile.length > 0) {
        const file = avatarFile[0];
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
      }
    }, [avatarFile]);

    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${initialData?.email || 'new-user'}`;
    const avatarSrc = avatarPreview || defaultAvatar;

    return (
      <>
        {/* Cột 1: Ảnh đại diện */}
        <div className="flex flex-col items-center gap-4 pt-2 md:border-r md:pr-8 border-slate-100">
          <label className="text-sm font-semibold text-slate-700">Ảnh đại diện</label>
          <div className="relative group w-32 h-32">
            <img
              src={avatarSrc}
              alt="Avatar Preview"
              className="w-full h-full rounded-full object-cover border-4 border-slate-50 shadow-md"
            />
            <label htmlFor="avatarFile" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={24} className="text-white" />
            </label>
            <input
              id="avatarFile"
              type="file"
              accept="image/*"
              className="hidden"
              {...register('avatarFile')}
            />
          </div>
          <p className="text-xs text-slate-400 text-center">Nhấp để thay đổi ảnh (Tối đa 2MB)</p>
        </div>

        {/* Cột 2: Các trường thông tin */}
        <div className="space-y-4">
          <Input
            label="Họ và tên"
            required
            placeholder="Nhập đầy đủ họ tên..."
            {...register('ho_va_ten', { required: 'Họ tên là bắt buộc' })}
            error={errors.ho_va_ten?.message}
          />
          
          <Input
            label="Email"
            type="email"
            required
            placeholder="email@example.com"
            {...register('email', {
              required: 'Email là bắt buộc',
              pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' }
            })}
            error={errors.email?.message}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-0.5">Vai trò hệ thống</label>
              <select
                {...register('vai_tro_id', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                disabled={isRolesLoading}
              >
                <option value="">-- Chọn vai trò --</option>
                {roles?.map(role => (
                  <option key={role.id} value={role.id}>{role.ten_vai_tro}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-0.5">Trạng thái tài khoản</label>
              <select
                {...register('trang_thai')}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="dang_hoat_dong">Đang hoạt động</option>
                <option value="da_khoa">Đã khóa</option>
              </select>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <GenericFormView<NhanVienInput>
      defaultValues={initialData}
      onSubmit={onSubmit}
      renderFields={renderFields}
      isLoading={isLoading}
      onCancel={onCancel}
    />
  );
};

export default NhanVienFormView;
