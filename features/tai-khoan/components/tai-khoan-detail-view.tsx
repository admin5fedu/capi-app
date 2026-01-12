import React, { useState, useMemo } from 'react';
import { TaiKhoan } from '../core/types';
import Badge from '../../../components/ui/Badge';
import { 
  Landmark, 
  Banknote,
  CreditCard,
  User,
  Info,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { useGiaoDichList } from '../../giao-dich/hooks/use-giao-dich-queries';
import { useTyGiaList } from '../../ty-gia/hooks/use-ty-gia-queries';
import LichSuGiaoDichMiniTable from './lich-su-giao-dich-mini-table';
import { cn } from '../../../lib/utils';

interface TaiKhoanDetailViewProps {
  data: TaiKhoan;
}

const formatUSD = (val: number | null | undefined) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
const formatMoney = (val: number | null | undefined, currency: string | null) => {
    if (val === null || val === undefined) val = 0;
    return currency === 'USD' ? formatUSD(val) : formatCurrency(val);
}

const TaiKhoanDetailView: React.FC<TaiKhoanDetailViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const { data: allGiaoDich, isLoading: isGiaoDichLoading } = useGiaoDichList();
  const { data: tyGiaList } = useTyGiaList();
  const latestRate = tyGiaList?.[0]?.ty_gia || 0;

  const relatedTransactions = useMemo(() => {
    if (!allGiaoDich) return [];
    return allGiaoDich.filter(
      gd => gd.tai_khoan_di_id === data.id || gd.tai_khoan_den_id === data.id
    );
  }, [allGiaoDich, data.id]);

  const isBank = data.loai_tai_khoan === 'tai_khoan';
  const currency = data.don_vi;
  const isUSD = currency === 'USD';
  const balance = data.so_du_cuoi;
  
  const infoItems = [
    { label: 'Tên tài khoản / Quỹ', value: data.ten_tai_khoan, icon: isBank ? Landmark : Banknote },
    { label: 'Trạng thái', value: data.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng hoạt động', icon: Info, badge: true },
    { label: 'Đơn vị tiền tệ', value: data.don_vi, icon: DollarSign, badge: true },
  ];
  
  const bankItems = [
    { label: 'Ngân hàng', value: data.ngan_hang, icon: Landmark },
    { label: 'Số tài khoản', value: data.so_tai_khoan, icon: CreditCard },
    { label: 'Chủ tài khoản', value: data.chu_tai_khoan, icon: User },
  ];

  const timeItems = [
    { label: 'Ngày tạo', value: data.tg_tao ? formatDate(data.tg_tao) : 'N/A', icon: Calendar },
    { label: 'Cập nhật lần cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : 'Chưa có', icon: Clock },
  ];

  const renderInfo = () => (
    <div className="px-6 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tổng quan</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-slate-400">Số dư đầu kỳ</p>
              <p className="font-bold text-sm text-slate-600">{formatMoney(data.so_du_dau_ky, currency)}</p>
              {isUSD && <p className="text-[10px] text-slate-400 font-medium">≈ {formatCurrency((data.so_du_dau_ky || 0) * latestRate)}</p>}
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-emerald-500">Tổng thu</p>
              <p className="font-bold text-sm text-emerald-600">{formatMoney(data.tong_thu, currency)}</p>
              {isUSD && <p className="text-[10px] text-emerald-400 font-medium">≈ {formatCurrency((data.tong_thu || 0) * latestRate)}</p>}
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-rose-500">Tổng chi</p>
              <p className="font-bold text-sm text-rose-600">{formatMoney(data.tong_chi, currency)}</p>
              {isUSD && <p className="text-[10px] text-rose-400 font-medium">≈ {formatCurrency((data.tong_chi || 0) * latestRate)}</p>}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin tài khoản</h4>
          <div className="space-y-4">
            {infoItems.map((item, idx) => item.value && (
              <div key={idx} className="flex items-start gap-4">
                <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  {item.badge ? (
                     <Badge variant={
                        item.label === 'Trạng thái' ? (data.trang_thai === 'hoat_dong' ? 'success' : 'destructive') : (data.don_vi === 'VND' ? 'info' : 'warning')
                      } className="mt-0.5">{item.value}</Badge>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
            {isBank && bankItems.map((item, idx) => item.value && (
               <div key={idx} className="flex items-start gap-4">
                <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin hệ thống</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {timeItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <item.icon size={16} className="text-slate-400" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );

  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
          <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-lg mb-4 ${
            isBank ? 'bg-blue-50 text-blue-500 shadow-blue-500/10' : 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10'
          }`}>
            {isBank ? <Landmark size={40} /> : <Banknote size={40} />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{data.ten_tai_khoan}</h3>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">{formatMoney(balance, currency)}</p>
          {isUSD && <p className="text-sm font-medium text-slate-400 mt-1">(Quy đổi ≈ {formatCurrency((balance || 0) * latestRate)})</p>}
        </div>
      </div>

      <div className="px-6 border-b border-slate-100">
        <div className="flex items-center -mb-px">
          <button
            onClick={() => setActiveTab('info')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2",
              activeTab === 'info' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <FileText size={16} />
            <span>Thông tin</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2",
              activeTab === 'history' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <BookOpen size={16} />
            <span>Lịch sử giao dịch</span>
            <Badge variant="secondary" className="h-5">{relatedTransactions.length}</Badge>
          </button>
        </div>
      </div>

      <div className="pt-6 pb-6">
        {activeTab === 'info' && renderInfo()}
        {activeTab === 'history' && (
          isGiaoDichLoading ? (
            <div className="flex items-center justify-center p-16 gap-3">
              <Loader2 size={20} className="text-slate-400 animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Đang tải lịch sử giao dịch...</p>
            </div>
          ) : (
            <LichSuGiaoDichMiniTable transactions={relatedTransactions} accountId={data.id} />
          )
        )}
      </div>
    </div>
  );
};

export default TaiKhoanDetailView;