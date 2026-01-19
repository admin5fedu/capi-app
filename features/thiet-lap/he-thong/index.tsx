
import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useAppStore } from '../../../store/app-store';
import { Palette, Check, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toast } from 'sonner';

const PRESET_COLORS = [
    { name: 'Mặc định', value: '#0F172A' },
    { name: 'Xanh dương', value: '#2563EB' },
    { name: 'Tím', value: '#7C3AED' },
    { name: 'Xanh lá', value: '#059669' },
    { name: 'Cam', value: '#EA580C' },
    { name: 'Hồng', value: '#DB2777' },
];

const CaiDatHeThong: React.FC = () => {
    const { primaryColor, setPrimaryColor } = useAppStore();

    const handleReset = () => {
        setPrimaryColor('#0F172A');
        toast.success('Đã khôi phục cài đặt mặc định');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cài đặt hệ thống</h1>
                <p className="text-slate-500 font-medium mt-1">Tùy chỉnh giao diện và cấu hình chung của ứng dụng.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Giao diện" description="Thay đổi màu sắc và chủ đề hiển thị của hệ thống.">
                    <div className="space-y-6 mt-4">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Palette size={18} className="text-primary" />
                                Màu chủ đạo (Primary Color)
                            </label>

                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-16 h-16 rounded-2xl border-4 border-white shadow-soft-lg cursor-pointer transition-transform hover:scale-105"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">{primaryColor.toUpperCase()}</p>
                                    <p className="text-xs text-slate-400 font-medium">Màu sắc này sẽ được áp dụng cho nút, sidebar và các thành phần chính khác.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Màu sắc có sẵn</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setPrimaryColor(color.value)}
                                        className={cn(
                                            "group relative w-full aspect-square rounded-xl transition-all duration-200 hover:scale-110",
                                            primaryColor === color.value ? "ring-2 ring-offset-2 ring-primary" : "hover:shadow-lg"
                                        )}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {primaryColor === color.value && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                                <Check size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-slate-600 gap-2"
                                onClick={handleReset}
                            >
                                <RotateCcw size={16} />
                                Khôi phục mặc định
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card title="Bản xem trước" description="Xem trước giao diện khi áp dụng màu sắc mới.">
                    <div className="mt-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-primary-glow">
                                <Check size={20} />
                            </div>
                            <div className="space-y-1">
                                <div className="h-4 w-32 bg-primary/20 rounded-md"></div>
                                <div className="h-3 w-24 bg-slate-200 rounded-md"></div>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-2">
                            <Button size="sm">Nút chính</Button>
                            <Button variant="outline" size="sm">Nút phụ</Button>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-700">Trạng thái hoạt động</span>
                                </div>
                                <span className="text-[10px] font-bold text-primary">CAM KẾT</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CaiDatHeThong;
