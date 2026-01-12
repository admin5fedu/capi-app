
import React from 'react';
import { useBaoCaoDoanhThuTheoKH } from '../hooks/use-bao-cao-queries';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../../../shared/utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';

interface BaoCaoDoanhThuTheoKHProps {
  startDate: Date;
  endDate: Date;
  nhomKHId: number | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-soft-lg border border-slate-100">
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        <p className="text-primary font-semibold mt-1">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const BaoCaoDoanhThuTheoKH: React.FC<BaoCaoDoanhThuTheoKHProps> = ({ startDate, endDate, nhomKHId }) => {
  const { data, isLoading } = useBaoCaoDoanhThuTheoKH(startDate, endDate, nhomKHId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-500">Đang tổng hợp dữ liệu...</p>
      </div>
    );
  }

  if (!data || data.tableData.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <Users size={32} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">Không có dữ liệu</p>
        <p className="text-sm text-slate-400 mt-1">Không có doanh thu từ khách hàng nào trong kỳ báo cáo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card title="Top 10 Khách hàng có doanh thu cao nhất" description={`Tổng doanh thu: ${formatCurrency(data.total)}`}>
        <div className="h-[350px] mt-4 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={(tick) => `${tick / 1000000}M`} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}/>
                    <Bar dataKey="value" name="Doanh thu" fill="#3B82F6" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>
      
      <Card noPadding title="Chi tiết doanh thu theo Khách hàng">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Xếp hạng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.tableData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold text-slate-400">#{index + 1}</TableCell>
                <TableCell className="font-semibold text-slate-800">{item.name}</TableCell>
                <TableCell className="text-right font-bold text-primary">{formatCurrency(item.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BaoCaoDoanhThuTheoKH;
