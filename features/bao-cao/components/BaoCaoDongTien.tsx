
import React from 'react';
import { useBaoCaoDongTien } from '../hooks/use-bao-cao-queries';
import Card from '../../../components/ui/Card';
import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowDown, ArrowUp, BarChart2, Loader2 } from 'lucide-react';
import GiaoDichTable from '../../giao-dich/components/giao-dich-table';

interface BaoCaoDongTienProps {
  startDate: Date;
  endDate: Date;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const thu = payload[0].value;
    const chi = payload[1].value;
    const net = thu - chi;
    return (
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-soft-lg border border-slate-100">
        <p className="font-bold text-slate-800 text-sm">{formatDate(label)}</p>
        <p className="text-emerald-600 font-semibold mt-2">Thu: {formatCurrency(thu)}</p>
        <p className="text-rose-600 font-semibold">Chi: {formatCurrency(chi)}</p>
        <div className="h-px bg-slate-200 my-2"></div>
        <p className={`font-bold text-sm ${net >= 0 ? 'text-blue-600' : 'text-slate-700'}`}>
            Dòng tiền ròng: {formatCurrency(net)}
        </p>
      </div>
    );
  }
  return null;
};

const BaoCaoDongTien: React.FC<BaoCaoDongTienProps> = ({ startDate, endDate }) => {
  const { data, isLoading } = useBaoCaoDongTien(startDate, endDate);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-slate-500">Đang tổng hợp dữ liệu...</p>
        </div>
    );
  }

  if (!data || data.filteredTransactions.length === 0) {
     return (
        <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <BarChart2 size={32} className="text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-900">Không có dữ liệu</p>
            <p className="text-sm text-slate-400 mt-1">Không tìm thấy giao dịch nào trong khoảng thời gian đã chọn.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50/50 border border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Tổng thu</p>
          <h3 className="text-2xl font-extrabold text-emerald-900 mt-1">{formatCurrency(data.totalThu)}</h3>
        </Card>
        <Card className="bg-rose-50/50 border border-rose-100">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Tổng chi</p>
          <h3 className="text-2xl font-extrabold text-rose-900 mt-1">{formatCurrency(data.totalChi)}</h3>
        </Card>
        <Card className={data.netFlow >= 0 ? 'bg-blue-50/50 border border-blue-100' : 'bg-slate-50 border border-slate-100'}>
          <p className={`text-xs font-bold uppercase tracking-widest ${data.netFlow >= 0 ? 'text-blue-600' : 'text-slate-600'}`}>Dòng tiền ròng</p>
          <h3 className={`text-2xl font-extrabold mt-1 ${data.netFlow >= 0 ? 'text-blue-900' : 'text-slate-900'}`}>{formatCurrency(data.netFlow)}</h3>
        </Card>
      </div>

      <Card title="Biểu đồ Dòng tiền" description="Trực quan hóa thu chi theo từng ngày trong kỳ báo cáo.">
        <div className="h-[350px] w-full mt-4 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                    dataKey="date" 
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
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
                <Bar dataKey="thu" fill="#10b981" name="Tổng Thu" radius={[8, 8, 0, 0]} />
                <Bar dataKey="chi" fill="#f43f5e" name="Tổng Chi" radius={[8, 8, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>
      
      <Card noPadding title="Chi tiết Giao dịch" description="Danh sách các giao dịch trong kỳ báo cáo.">
        <GiaoDichTable
            data={data.filteredTransactions}
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
        />
      </Card>
    </div>
  );
};

export default BaoCaoDongTien;
