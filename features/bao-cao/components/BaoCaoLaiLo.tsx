
import React from 'react';
import { useBaoCaoLaiLo } from '../hooks/use-bao-cao-queries';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../../../shared/utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Scale, FileText } from 'lucide-react';
import { PnlBreakdownItem } from '../core/types';
import { cn } from '../../../lib/utils';
import PnlBreakdownCard from './PnlBreakdownCard';

interface BaoCaoLaiLoProps {
  startDate: Date;
  endDate: Date;
}

const BaoCaoLaiLo: React.FC<BaoCaoLaiLoProps> = ({ startDate, endDate }) => {
  const { data, isLoading } = useBaoCaoLaiLo(startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-500">Đang tổng hợp dữ liệu...</p>
      </div>
    );
  }

  if (!data || (data.totalRevenue === 0 && data.totalExpenses === 0)) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <FileText size={32} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">Không có dữ liệu</p>
        <p className="text-sm text-slate-400 mt-1">Không có doanh thu hoặc chi phí nào được ghi nhận trong kỳ báo cáo.</p>
      </div>
    );
  }

  const isProfit = data.netProfit >= 0;
  const chartData = [{ name: 'Kết quả kinh doanh', revenue: data.totalRevenue, expense: data.totalExpenses }];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50/50 border border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14}/>Tổng Doanh thu</p>
          <h3 className="text-2xl font-extrabold text-emerald-900 mt-1">{formatCurrency(data.totalRevenue)}</h3>
        </Card>
        <Card className="bg-rose-50/50 border border-rose-100">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2"><TrendingDown size={14}/>Tổng Chi phí</p>
          <h3 className="text-2xl font-extrabold text-rose-900 mt-1">{formatCurrency(data.totalExpenses)}</h3>
        </Card>
        <Card className={isProfit ? 'bg-primary/5 border border-primary/10' : 'bg-destructive/5 border border-destructive/10'}>
          <p className={cn("text-xs font-bold uppercase tracking-widest flex items-center gap-2", isProfit ? 'text-primary' : 'text-destructive')}>
            <Scale size={14}/>Lợi nhuận ròng
          </p>
          <h3 className={cn("text-2xl font-extrabold mt-1", isProfit ? 'text-blue-900' : 'text-rose-900')}>
            {formatCurrency(data.netProfit)}
          </h3>
        </Card>
      </div>

      <Card title="So sánh Doanh thu & Chi phí">
        <div className="h-[250px] w-full mt-4 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(tick) => `${tick / 1000000}M`} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(4px)',
                borderRadius: '1rem',
                border: '1px solid #f1f5f9'
              }}/>
              <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" radius={[8, 8, 0, 0]} barSize={60} />
              <Bar dataKey="expense" fill="#f43f5e" name="Chi phí" radius={[8, 8, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PnlBreakdownCard title="Cơ cấu Doanh thu" data={data.revenueBreakdown} total={data.totalRevenue} color="emerald" />
        <PnlBreakdownCard title="Cơ cấu Chi phí" data={data.expenseBreakdown} total={data.totalExpenses} color="rose" />
      </div>
    </div>
  );
};

export default BaoCaoLaiLo;
