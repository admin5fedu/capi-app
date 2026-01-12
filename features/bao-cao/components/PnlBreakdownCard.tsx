
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../../../shared/utils/format';
import { PnlBreakdownItem } from '../core/types';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#64748B'];
const COLORS_EXPENSE = ['#EF4444', '#F97316', '#F59E0B', '#8B5CF6', '#3B82F6', '#64748B'];

interface PnlBreakdownCardProps {
  title: string;
  data: PnlBreakdownItem[];
  total: number;
  color: 'emerald' | 'rose';
}

const PnlBreakdownCard: React.FC<PnlBreakdownCardProps> = ({ title, data, total, color }) => {
  const top5 = data.slice(0, 5);
  const otherValue = data.slice(5).reduce((sum, item) => sum + item.value, 0);
  const chartData = [...top5];
  if (otherValue > 0) {
    chartData.push({ name: 'Khác', value: otherValue });
  }

  const currentColors = color === 'emerald' ? COLORS : COLORS_EXPENSE;

  return (
    <Card title={title} description={`Tổng: ${formatCurrency(total)}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
                ))}
              </Pie>
               <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '0.75rem',
                  border: '1px solid #f1f5f9'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={item.name} className="flex flex-col">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 truncate">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentColors[index % currentColors.length] }}></div>
                        <span className="font-semibold text-slate-700 truncate" title={item.name}>{item.name}</span>
                    </div>
                    <div className="font-bold text-slate-500">{percentage}%</div>
                </div>
                <div className="text-right text-xs font-bold text-slate-400">
                    {formatCurrency(item.value)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  );
};

export default PnlBreakdownCard;
