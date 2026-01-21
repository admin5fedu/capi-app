
import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../../store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from './services/profile-service';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Camera,
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../../../shared/utils/format';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { useAvatarUrl } from '../../../shared/hooks/use-avatar-url';

const HoSoModule: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my_profile', user?.email],
    queryFn: () => profileService.getCurrentUserProfile(user?.email || ''),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: any) => profileService.updateProfile(profile.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my_profile'] });
      toast.success('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error('Lỗi khi cập nhật: ' + error.message);
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Đang tải ảnh lên...');

    try {
      const filePath = await profileService.uploadAvatar(profile.id, file);
      await updateMutation.mutateAsync({ avatar: filePath });
      toast.success('Đã cập nhật ảnh đại diện!', { id: toastId });
    } catch (error: any) {
      toast.error('Lỗi tải ảnh: ' + error.message, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const { register, handleSubmit, reset } = useForm({
    values: { ho_va_ten: profile?.ho_va_ten || '' }
  });

  const onSubmit = (data: { ho_va_ten: string }) => {
    updateMutation.mutate({ ho_va_ten: data.ho_va_ten });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang tải hồ sơ của bạn...</p>
      </div>
    );
  }

  const { avatarUrl } = useAvatarUrl(profile?.avatar, user?.id || 'CapiAdmin');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-primary/80 to-blue-600 rounded-[32px] shadow-lg shadow-primary/10"></div>
        <div className="absolute -bottom-16 left-8 flex flex-col md:flex-row items-end gap-6 px-4">
          <div className="relative group">
            <div
              className="w-32 h-32 rounded-[40px] bg-white p-2 shadow-2xl border-4 border-white dark:border-slate-800 cursor-pointer overflow-hidden relative"
              onClick={handleAvatarClick}
            >
              <img
                src={avatarUrl}
                alt="Avatar Large"
                className={`w-full h-full rounded-[32px] bg-slate-50 object-cover transition-all duration-300 ${isUploading ? 'opacity-40 scale-90' : 'group-hover:scale-110'}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="pb-4 space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profile?.ho_va_ten || user?.email?.split('@')[0]}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="px-3">Trực tuyến</Badge>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">ID: #{profile?.id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
        <div className="space-y-6">
          <Card title="Thông tin tài khoản" description="Chi tiết phân quyền hệ thống.">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email công việc</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Vai trò hiện tại</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                    {profile?.trang_thai === 'dang_hoat_dong' ? 'Quản trị viên' : 'Nhân viên'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ngày gia nhập</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {profile?.tg_tao ? formatDate(profile.tg_tao) : 'Hôm nay'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Hành động" noPadding className="overflow-hidden">
            <div className="divide-y divide-slate-50">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left"
              >
                <Lock size={18} className="text-slate-400" />
                Thay đổi mật khẩu
              </button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Thông tin cá nhân"
            description="Cập nhật thông tin định danh của bạn trong tổ chức."
            headerAction={
              !isEditing ? (
                <Button variant="outline" size="sm" className="rounded-xl h-9" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
              ) : null
            }
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <Input
                    label="Họ và tên hiển thị"
                    disabled={!isEditing}
                    placeholder="Nhập tên của bạn..."
                    {...register('ho_va_ten', { required: true })}
                  />
                </div>

                <div className="opacity-60 cursor-not-allowed">
                  <Input
                    label="Email (Không thể thay đổi)"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="opacity-60 cursor-not-allowed">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-0.5">Trạng thái hệ thống</label>
                    <div className="flex items-center gap-2 h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold text-emerald-600">
                      <CheckCircle2 size={16} />
                      Đã xác thực tài khoản
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-50">
                  <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); reset(); }}>
                    Hủy bỏ
                  </Button>
                  <Button type="submit" className="gap-2 shadow-primary-glow" isLoading={updateMutation.isPending}>
                    <Save size={18} />
                    Lưu hồ sơ
                  </Button>
                </div>
              )}
            </form>
          </Card>

          <Card title="Ghi chú & Bảo mật">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
              <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900 leading-tight">Mẹo bảo mật tài khoản</p>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Để đảm bảo an toàn cho dữ liệu ERP, hãy đảm bảo bạn không chia sẻ mật khẩu của mình with bất kỳ ai khác và thường xuyên thay đổi mật khẩu định kỳ 90 ngày.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

interface PasswordChangeModalProps {
  onClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('password');

  const onUpdatePassword = async (data: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) throw error;

      toast.success('Mật khẩu đã được thay đổi thành công!');
      onClose();
    } catch (error: any) {
      toast.error('Lỗi khi đổi mật khẩu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thay đổi mật khẩu</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onUpdatePassword)} className="p-8 space-y-6">
          <div className="relative">
            <Input
              label="Mật khẩu mới"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              required
              {...register('password', {
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: { value: 6, message: 'Mật khẩu phải từ 6 ký tự' }
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input
            label="Xác nhận mật khẩu"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            required
            {...register('confirmPassword', {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: value => value === newPassword || 'Mật khẩu xác nhận không khớp'
            })}
            error={errors.confirmPassword?.message}
          />

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={18} />
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
              Mật khẩu mới phải khác với mật khẩu hiện tại và không nên dễ đoán. Hệ thống sẽ yêu cầu bạn đăng nhập lại sau khi thay đổi.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" className="flex-1 shadow-primary-glow" isLoading={isLoading}>
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HoSoModule;
