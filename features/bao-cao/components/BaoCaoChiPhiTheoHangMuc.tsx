
import React from 'react';
import { useBaoCaoChiPhiTheoHangMuc } from '../hooks/use-bao-cao-queries';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../../../shared/utils/format';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Treemap } from 'recharts';
import { ListTree, Loader2 } from 'lucide-react';
import ChiPhiHangMucTable from './ChiPhiHangMucTable';

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

interface BaoCaoChiPhiTheoHangMucProps {
  startDate: Date;
  endDate: Date;
  taiKhoanId: number | null;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = ((data.value / payload[0].payload.total) * 100).toFixed(2);
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-soft-lg border border-slate-100">
        <p className="font-bold text-slate-800 text-sm">{data.name}</p>
        <p className="text-rose-600 font-semibold mt-1">{formatCurrency(data.value)} ({percent}%)</p>
      </div>
    );
  }
  return null;
};

const CustomizedContent = ({ root, depth, x, y, width, height, index, payload, rank, name, value }: any) => {
  if (width < 20 || height < 20) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2,
        }}
      />
      {width > 80 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {name}
        </text>
      )}
      {width > 80 && height > 50 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 16}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
        >
          {formatCurrency(value)}
        </text>
      )}
    </g>
  );
};

const BaoCaoChiPhiTheoHangMuc: React.FC<BaoCaoChiPhiTheoHangMucProps> = ({ startDate, endDate, taiKhoanId }) => {
  const { data, isLoading } = useBaoCaoChiPhiTheoHangMuc(startDate, endDate, taiKhoanId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-500">Đang tổng hợp dữ liệu...</p>
      </div>
    );
  }

  if (!data || data.treeData.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
          <ListTree size={32} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-900">Không có dữ liệu</p>
        <p className="text-sm text-slate-400 mt-1">Không có chi phí nào theo hạng mục trong kỳ báo cáo.</p>
      </div>
    );
  }

  const pieDataWithTotal = data.pieChartData.map(d => ({ ...d, total: data.total }));

  return (
    <div className="space-y-8">
      <Card title="Tỷ trọng các nhóm chi phí chính" description={`Tổng chi phí: ${formatCurrency(data.total)}`}>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieDataWithTotal} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                {pieDataWithTotal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Phân bổ chi phí (Treemap)" description="Trực quan hóa tỷ trọng của từng khoản mục chi phí.">
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data.treeData}
              dataKey="value"
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedContent />}
            />
          </ResponsiveContainer>
        </div>
      </Card>

      <Card noPadding title="Chi tiết cơ cấu chi phí">
        <ChiPhiHangMucTable data={data.treeData} total={data.total} />
      </Card>
    </div>
  );
};

export default BaoCaoChiPhiTheoHangMuc;
