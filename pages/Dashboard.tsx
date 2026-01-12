
import React, { useMemo } from 'react';
import Card from '../components/ui/Card';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight,
  Calendar,
  Zap,
  MoreVertical,
  Loader2,
  TrendingDown,
  ArrowDown,
  ArrowUp,
  ArrowRightLeft
} from 'lucide-react';
import { formatCurrency, formatDate } from '../shared/utils/format';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';
import { useGiaoDichList } from '../features/giao-dich/hooks/use-giao-dich-queries';
import { useKhachHangList } from '../features/khach-hang/hooks/use-khach-hang-queries';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { GiaoDich } from '../features/giao-dich/core/types';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-soft-lg border border-slate-100">
        <p className="font-bold text-slate-800 text-sm">Tháng {label}</p>
        <p className="text-primary font-semibold mt-1">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const formatTrend = (trendValue: number) => {
  if (!isFinite(trendValue)) return '+∞%';
  const sign = trendValue >= 0 ? '+' : '';
  return `${sign}${trendValue.toFixed(1)}%`;
};

const Dashboard: React.FC = () => {
  const { data: transactions, isLoading: isTransactionsLoading } = useGiaoDichList();
  const { data: customers, isLoading: isCustomersLoading } = useKhachHangList();

  const dashboardStats = useMemo(() => {
    if (!transactions || !customers) {
      return {
        revenue: { value: 0, trend: 0 },
        newCustomers: { value: 0, trend: 0 },
        revenueTransactions: { value: 0, trend: 0 },
        expenses: { value: 0, trend: 0 },
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? Infinity : 0;
      return ((current - previous) / previous) * 100;
    };
    
    const filterAndSum = (data: GiaoDich[], hangMuc: 'thu' | 'chi', start: Date, end: Date) => {
        const field = hangMuc === 'thu' ? 'so_tien_quy_doi_den' : 'so_tien_quy_doi_di';
        return data.filter(t => t.hang_muc === hangMuc && new Date(t.ngay!) >= start && new Date(t.ngay!) <= end)
                   .reduce((sum, t) => sum + (t[field] || t.so_tien || 0), 0);
    };

    const currentMonthRevenue = filterAndSum(transactions, 'thu', startOfMonth, endOfMonth);
    const lastMonthRevenue = filterAndSum(transactions, 'thu', startOfLastMonth, endOfLastMonth);

    const currentMonthNewCustomers = customers.filter(c => new Date(c.tg_tao!) >= startOfMonth && new Date(c.tg_tao!) <= endOfMonth).length;
    const lastMonthNewCustomers = customers.filter(c => new Date(c.tg_tao!) >= startOfLastMonth && new Date(c.tg_tao!) <= endOfLastMonth).length;

    const currentMonthRevenueTransactions = transactions.filter(t => t.hang_muc === 'thu' && new Date(t.ngay!) >= startOfMonth && new Date(t.ngay!) <= endOfMonth).length;
    const lastMonthRevenueTransactions = transactions.filter(t => t.hang_muc === 'thu' && new Date(t.ngay!) >= startOfLastMonth && new Date(t.ngay!) <= endOfLastMonth).length;
    
    const currentMonthExpenses = filterAndSum(transactions, 'chi', startOfMonth, endOfMonth);
    const lastMonthExpenses = filterAndSum(transactions, 'chi', startOfLastMonth, endOfLastMonth);

    return {
      revenue: { value: currentMonthRevenue, trend: calculateTrend(currentMonthRevenue, lastMonthRevenue) },
      newCustomers: { value: currentMonthNewCustomers, trend: calculateTrend(currentMonthNewCustomers, lastMonthNewCustomers) },
      revenueTransactions: { value: currentMonthRevenueTransactions, trend: calculateTrend(currentMonthRevenueTransactions, lastMonthRevenueTransactions) },
      expenses: { value: currentMonthExpenses, trend: calculateTrend(currentMonthExpenses, lastMonthExpenses) },
    };
  }, [transactions, customers]);
  
   const stats = [
    { 
      title: 'Doanh thu tháng', 
      value: dashboardStats.revenue.value, 
      trend: formatTrend(dashboardStats.revenue.trend), 
      isPositive: dashboardStats.revenue.trend >= 0, 
      icon: DollarSign, 
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      title: 'Khách hàng mới', 
      value: dashboardStats.newCustomers.value, 
      trend: formatTrend(dashboardStats.newCustomers.trend), 
      isPositive: dashboardStats.newCustomers.trend >= 0, 
      icon: Users, 
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    { 
      title: 'Giao dịch thu', 
      value: dashboardStats.revenueTransactions.value, 
      trend: formatTrend(dashboardStats.revenueTransactions.trend), 
      isPositive: dashboardStats.revenueTransactions.trend >= 0, 
      icon: ShoppingCart, 
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    { 
      title: 'Chi phí tháng', 
      value: dashboardStats.expenses.value, 
      trend: formatTrend(dashboardStats.expenses.trend), 
      isPositive: dashboardStats.expenses.trend <= 0, // Lower expense is positive
      icon: TrendingDown, 
      color: 'text-rose-500',
      bg: 'bg-rose-50'
    },
  ];

  const monthlyRevenueData = useMemo(() => {
    if (!transactions) return [];

    const monthlyData: { [key: string]: number } = {};
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = 0;
    }

    transactions.forEach(t => {
      const transactionDate = new Date(t.ngay!);
      const monthKey = `${transactionDate.getFullYear()}/${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      if (t.hang_muc === 'thu' && monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += t.so_tien_quy_doi_den || t.so_tien || 0;
      }
    });

    return Object.entries(monthlyData)
      .map(([name, revenue]) => ({ 
        name: name.substring(5), 
        revenue 
      }));
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.slice(0, 5); 
  }, [transactions]);
  
  const isLoading = isTransactionsLoading || isCustomersLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-slate-500 font-medium mt-1">Chào Admin, dưới đây là tình hình hoạt động của doanh nghiệp hôm nay.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            <Calendar size={18} className="text-slate-400" />
            01/01/2024 - Hiện tại
          </Button>
          <Button className="rounded-xl font-bold gap-2 shadow-primary-glow">
            <Zap size={18} />
            Tạo báo cáo
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="group">
             {isLoading ? (
                <div className="h-[95px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                </div>
             ) : (
                <>
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                        <stat.icon size={22} />
                      </div>
                      <button className="text-slate-300 hover:text-slate-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                      <div className="flex items-end gap-3 mt-1">
                        <h3 className="text-2xl font-extrabold text-slate-900">
                          {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
                        </h3>
                        <div className={cn(
                          "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1.5",
                          stat.isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                        )}>
                          {stat.trend}
                        </div>
                      </div>
                    </div>
                </>
             )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card 
          className="lg:col-span-2" 
          title="Phân tích tăng trưởng" 
          description="Dữ liệu doanh thu 6 tháng gần nhất."
        >
          <div className="h-[300px] w-full mt-4 -ml-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang tải biểu đồ...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(tick) => `${tick / 1000000}M`} fontSize={12} tickLine={false} axisLine={false} domain={['dataMin', 'auto']} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(221.2 83.2% 53.3%)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card 
          title="Hoạt động mới" 
          description="Các giao dịch gần nhất."
          headerAction={<Button variant="ghost" size="sm" className="text-[10px] font-bold text-primary">XEM TẤT CẢ</Button>}
        >
          <div className="space-y-4">
            {isLoading ? (
                 <div className="h-[250px] flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                </div>
            ) : (
                recentTransactions.map((t) => {
                    const iconMap = {
                        thu: { icon: ArrowDown, color: 'bg-emerald-50 text-emerald-600' },
                        chi: { icon: ArrowUp, color: 'bg-rose-50 text-rose-600' },
                        chuyen_tien: { icon: ArrowRightLeft, color: 'bg-blue-50 text-blue-600' }
                    };
                    const { icon: Icon, color } = iconMap[t.hang_muc as keyof typeof iconMap] || iconMap.chuyen_tien;
                    return (
                        <div key={t.id} className="flex items-center gap-4 group cursor-pointer">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors truncate">{t.mo_ta}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{formatDate(t.ngay!)}</p>
                            </div>
                             <div className={cn("font-bold text-sm", t.hang_muc === 'thu' ? 'text-emerald-600' : t.hang_muc === 'chi' ? 'text-rose-600' : 'text-slate-600')}>
                                {t.hang_muc === 'chi' ? '-' : '+'} {formatCurrency(t.so_tien || 0)}
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
