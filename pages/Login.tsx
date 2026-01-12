
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'sonner';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email công việc không hợp lệ').min(1, 'Vui lòng nhập email'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuthStore();

  // Tự động chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      if (authData.session) {
        setAuth(authData.session); // Cập nhật state ngay lập tức để trigger useEffect
      }
      
      toast.success('Đăng nhập thành công!');
      // Không cần navigate ở đây vì useEffect phía trên sẽ lo việc này khi isAuthenticated thay đổi
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-primary text-white shadow-2xl shadow-primary/40 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 text-center w-full">Capi ERP</h1>
          <p className="text-slate-500 font-medium text-lg">Xác thực hệ thống quản trị</p>
        </div>

        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none p-2 ring-1 ring-slate-200/60 bg-white/80 backdrop-blur-xl">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <Input
                  label="Email công việc"
                  required
                  placeholder="admin@capierp.com"
                  {...register('email')}
                  error={errors.email?.message}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-[38px] text-slate-400" size={18} />
              </div>

              <div className="relative space-y-1">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-semibold text-slate-700 ml-0.5">
                    Mật khẩu
                    <span className="text-destructive ml-1">*</span>
                   </label>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    {...register('password')}
                    className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all ${errors.password ? 'border-destructive' : ''}`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
                {errors.password && <p className="text-[11px] font-medium text-destructive ml-0.5">{errors.password.message}</p>}
              </div>

              <Button 
                isLoading={isLoading} 
                className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-4" 
                type="submit"
              >
                Đăng nhập ngay
              </Button>
            </form>
          </div>
        </Card>
        
        <p className="text-center mt-8 text-slate-400 text-sm">
          Sử dụng tài khoản Supabase Auth của bạn
        </p>
      </div>
    </div>
  );
};

export default Login;