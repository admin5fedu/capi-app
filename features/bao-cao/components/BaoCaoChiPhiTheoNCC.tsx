
import React from 'react';
import { useBaoCaoChiPhiTheoNCC } from '../hooks/use-bao-cao-queries';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../../../shared/utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Truck, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';

interface BaoCaoChiPhiTheoNCCProps {
  startDate: Date;
  endDate: Date;
  nhomNCCId: number | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-soft-lg border border-slate-100">
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        <p className="text-rose-600 font-semibold mt-1">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};


const BaoCaoChiPhiTheoNCC: React.FC<BaoCaoChiPhiTheoNCCProps> = ({ startDate, endDate, nhomNCCId }) => {
  const { data, isLoading } = useBaoCaoChiPhiTheoNCC(startDate, endDate, nhomNCCId);

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
          <Truck size={32} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">Không có dữ liệu</p>
        <p className="text-sm text-slate-400 mt-1">Không có chi phí nào cho nhà cung cấp trong kỳ báo cáo.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Card title="Top 10 Nhà cung cấp có chi phí cao nhất" description={`Tổng chi phí: ${formatCurrency(data.total)}`}>
        <div className="h-[350px] mt-4 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={(tick) => `${tick / 1000000}M`} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}/>
                    <Bar dataKey="value" name="Chi phí" fill="#f43f5e" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </Card>

       <Card noPadding title="Chi tiết chi phí theo Nhà cung cấp">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Xếp hạng</TableHead>
                        <TableHead>Nhà cung cấp</TableHead>
                        <TableHead className="text-right">Tổng chi phí</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.tableData.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-bold text-slate-400">#{index + 1}</TableCell>
                            <TableCell className="font-semibold text-slate-800">{item.name}</TableCell>
                            <TableCell className="text-right font-bold text-rose-600">{formatCurrency(item.value)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
       </Card>
    </div>
  );
};

export default BaoCaoChiPhiTheoNCC;
