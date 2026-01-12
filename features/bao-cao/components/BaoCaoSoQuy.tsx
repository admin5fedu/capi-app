
import React from 'react';
import { useBaoCaoSoQuy } from '../hooks/use-bao-cao-queries';
import Card from '../../../components/ui/Card';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BookOpen, Loader2, WalletCards, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';
import SoQuyTable from './SoQuyTable';

interface BaoCaoSoQuyProps {
  accountId: number | null;
  startDate: Date;
  endDate: Date;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-soft-lg border border-slate-100">
        <p className="font-bold text-slate-800 text-sm">Ngày: {formatDate(label)}</p>
        <p className="text-sm text-slate-500 mt-1">{dataPoint.mo_ta}</p>
        <p className="text-blue-600 font-semibold mt-1">Số dư: {formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const BaoCaoSoQuy: React.FC<BaoCaoSoQuyProps> = ({ accountId, startDate, endDate }) => {
  const { data, isLoading } = useBaoCaoSoQuy(accountId, startDate, endDate);

  if (!accountId) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <WalletCards size={32} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">Vui lòng chọn tài khoản</p>
        <p className="text-sm text-slate-400 mt-1">Chọn một tài khoản hoặc quỹ từ bộ lọc phía trên để xem sổ quỹ chi tiết.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-500">Đang tính toán sổ quỹ...</p>
      </div>
    );
  }

  if (!data || data.ledgerData.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <BookOpen size={32} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">Không có giao dịch</p>
        <p className="text-sm text-slate-400 mt-1">Không có giao dịch nào phát sinh cho tài khoản này trong kỳ báo cáo.</p>
      </div>
    );
  }

  const chartData = [
    {
      ngay: startDate.toISOString(),
      thu: 0,
      chi: 0,
      ton_cuoi: data.soDuDauKy,
      mo_ta: 'Số dư đầu kỳ'
    },
    ...data.ledgerData
  ];
  
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-50/50 border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">Số dư đầu kỳ</p>
          <h3 className="text-xl font-extrabold text-slate-800 mt-1">{formatCurrency(data.soDuDauKy)}</h3>
        </Card>
        <Card className="bg-emerald-50/50 border border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><ArrowDown size={12}/>Tổng thu trong kỳ</p>
          <h3 className="text-xl font-extrabold text-emerald-900 mt-1">{formatCurrency(data.tongThuTrongKy)}</h3>
        </Card>
        <Card className="bg-rose-50/50 border border-rose-100">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2"><ArrowUp size={12}/>Tổng chi trong kỳ</p>
          <h3 className="text-xl font-extrabold text-rose-900 mt-1">{formatCurrency(data.tongChiTrongKy)}</h3>
        </Card>
        <Card className="bg-blue-50/50 border border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2"><PiggyBank size={12}/>Số dư cuối kỳ</p>
          <h3 className="text-xl font-extrabold text-blue-900 mt-1">{formatCurrency(data.soDuCuoiKy)}</h3>
        </Card>
      </div>

      <Card title="Biểu đồ biến động số dư">
        <div className="h-[300px] w-full mt-4 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                  dataKey="ngay" 
                  tickFormatter={(tick) => formatDate(tick).substring(0, 5)}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
              />
              <YAxis 
                  tickFormatter={(tick) => `${tick / 1000000}M`}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 100000', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ton_cuoi" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" name="Số dư" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card 
        noPadding 
        title={`Sổ quỹ chi tiết: ${data.accountDetails.ten_tai_khoan}`}
        description={`Bảng sao kê các giao dịch từ ${formatDate(startDate)} đến ${formatDate(endDate)}.`}
      >
        <SoQuyTable data={data.ledgerData} />
      </Card>
    </div>
  );
};

export default BaoCaoSoQuy;
