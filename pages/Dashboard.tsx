
import React, { useMemo, useState } from 'react';
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
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '../shared/utils/format';
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

type PeriodType = 'today' | 'this_month' | 'last_month' | 'this_year' | 'all' | 'custom';

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('this_month');
  const [customRange, setCustomRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const { data: transactions, isLoading: isTransactionsLoading } = useGiaoDichList();
  const { data: customers, isLoading: isCustomersLoading } = useKhachHangList();

  const getDateRange = (p: PeriodType) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    let prevStart = new Date();
    let prevEnd = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    switch (p) {
      case 'today':
        start = today;
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        prevStart = new Date(start);
        prevStart.setDate(prevStart.getDate() - 1);
        prevEnd = new Date(end);
        prevEnd.setDate(prevEnd.getDate() - 1);
        break;
      case 'this_month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'last_month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
        break;
      case 'this_year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        prevStart = new Date(now.getFullYear() - 1, 0, 1);
        prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;
      case 'custom':
        start = new Date(customRange.start);
        end = new Date(customRange.end);
        end.setHours(23, 59, 59);
        // For custom, trend is hard to define simply, let's compare to same duration before
        const duration = end.getTime() - start.getTime();
        prevEnd = new Date(start.getTime() - 1);
        prevStart = new Date(prevEnd.getTime() - duration);
        break;
      default: // all
        start = new Date(2000, 0, 1);
        end = new Date(2100, 0, 1);
        prevStart = new Date(1900, 0, 1);
        prevEnd = new Date(1999, 11, 31);
    }
    return { start, end, prevStart, prevEnd };
  };

  const periodLabel = useMemo(() => {
    switch (period) {
      case 'today': return 'Hôm nay';
      case 'this_month': return 'Tháng này';
      case 'last_month': return 'Tháng trước';
      case 'this_year': return 'Năm nay';
      case 'all': return 'Tất cả';
      case 'custom': return `${formatDate(customRange.start)} - ${formatDate(customRange.end)}`;
      default: return 'Chọn thời gian';
    }
  }, [period, customRange]);

  const dashboardStats = useMemo(() => {
    if (!transactions || !customers) {
      return {
        revenue: { value: 0, trend: 0 },
        newCustomers: { value: 0, trend: 0 },
        revenueTransactions: { value: 0, trend: 0 },
        expenses: { value: 0, trend: 0 },
      };
    }

    const { start: currentStart, end: currentEnd, prevStart, prevEnd } = getDateRange(period);

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? Infinity : 0;
      return ((current - previous) / previous) * 100;
    };

    const filterAndSum = (data: GiaoDich[], hangMuc: 'thu' | 'chi', start: Date, end: Date) => {
      const field = hangMuc === 'thu' ? 'so_tien_quy_doi_den' : 'so_tien_quy_doi_di';
      return data.filter(t => t.hang_muc === hangMuc && new Date(t.ngay!) >= start && new Date(t.ngay!) <= end)
        .reduce((sum, t) => sum + (t[field] || t.so_tien || 0), 0);
    };

    const currentMonthRevenue = filterAndSum(transactions, 'thu', currentStart, currentEnd);
    const lastMonthRevenue = filterAndSum(transactions, 'thu', prevStart, prevEnd);

    const currentMonthNewCustomers = customers.filter(c => new Date(c.tg_tao!) >= currentStart && new Date(c.tg_tao!) <= currentEnd).length;
    const lastMonthNewCustomers = customers.filter(c => new Date(c.tg_tao!) >= prevStart && new Date(c.tg_tao!) <= prevEnd).length;

    const currentMonthRevenueTransactions = transactions.filter(t => t.hang_muc === 'thu' && new Date(t.ngay!) >= currentStart && new Date(t.ngay!) <= currentEnd).length;
    const lastMonthRevenueTransactions = transactions.filter(t => t.hang_muc === 'thu' && new Date(t.ngay!) >= prevStart && new Date(t.ngay!) <= prevEnd).length;

    const currentMonthExpenses = filterAndSum(transactions, 'chi', currentStart, currentEnd);
    const lastMonthExpenses = filterAndSum(transactions, 'chi', prevStart, prevEnd);

    return {
      revenue: { value: currentMonthRevenue, trend: calculateTrend(currentMonthRevenue, lastMonthRevenue) },
      newCustomers: { value: currentMonthNewCustomers, trend: calculateTrend(currentMonthNewCustomers, lastMonthNewCustomers) },
      revenueTransactions: { value: currentMonthRevenueTransactions, trend: calculateTrend(currentMonthRevenueTransactions, lastMonthRevenueTransactions) },
      expenses: { value: currentMonthExpenses, trend: calculateTrend(currentMonthExpenses, lastMonthExpenses) },
    };
  }, [transactions, customers, period, customRange]);

  const stats = [
    {
      title: 'Doanh thu tháng',
      value: dashboardStats.revenue.value,
      trend: formatTrend(dashboardStats.revenue.trend),
      isPositive: dashboardStats.revenue.trend >= 0,
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
      format: 'currency'
    },
    {
      title: 'Khách hàng mới',
      value: dashboardStats.newCustomers.value,
      trend: formatTrend(dashboardStats.newCustomers.trend),
      isPositive: dashboardStats.newCustomers.trend >= 0,
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      format: 'number'
    },
    {
      title: 'Giao dịch thu',
      value: dashboardStats.revenueTransactions.value,
      trend: formatTrend(dashboardStats.revenueTransactions.trend),
      isPositive: dashboardStats.revenueTransactions.trend >= 0,
      icon: ShoppingCart,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      format: 'number'
    },
    {
      title: 'Chi phí tháng',
      value: dashboardStats.expenses.value,
      trend: formatTrend(dashboardStats.expenses.trend),
      isPositive: dashboardStats.expenses.trend <= 0, // Lower expense is positive
      icon: TrendingDown,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      format: 'currency'
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
    const { start, end } = getDateRange(period);
    return transactions
      .filter(t => new Date(t.ngay!) >= start && new Date(t.ngay!) <= end)
      .slice(0, 5);
  }, [transactions, period, customRange]);

  const isLoading = isTransactionsLoading || isCustomersLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-slate-500 font-medium mt-1">Chào Admin, dưới đây là tình hình hoạt động của doanh nghiệp hôm nay.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 min-w-[180px] justify-between"
              onClick={() => setShowCustomPicker(!showCustomPicker)}
            >
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" />
                {periodLabel}
              </div>
              <ChevronDown size={14} className={cn("transition-transform", showCustomPicker && "rotate-180")} />
            </Button>

            {showCustomPicker && (
              <div className="absolute right-0 mt-2 p-4 bg-white rounded-2xl shadow-premium border border-slate-100 min-w-[280px] z-50 animate-in fade-in zoom-in duration-200">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { id: 'today', label: 'Hôm nay' },
                    { id: 'this_month', label: 'Tháng này' },
                    { id: 'last_month', label: 'Tháng trước' },
                    { id: 'this_year', label: 'Năm nay' },
                    { id: 'all', label: 'Tất cả' },
                    { id: 'custom', label: 'Tùy chỉnh' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPeriod(p.id as PeriodType);
                        if (p.id !== 'custom') setShowCustomPicker(false);
                      }}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-bold transition-all",
                        period === p.id
                          ? "bg-primary text-white shadow-primary-glow"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {period === 'custom' && (
                  <div className="space-y-3 pt-2 border-t border-slate-50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Từ ngày</label>
                      <input
                        type="date"
                        value={customRange.start}
                        onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Đến ngày</label>
                      <input
                        type="date"
                        value={customRange.end}
                        onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <Button
                      className="w-full rounded-xl py-2 text-xs font-bold"
                      onClick={() => setShowCustomPicker(false)}
                    >
                      Áp dụng
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button className="rounded-xl font-bold gap-2 shadow-primary-glow hidden md:flex">
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
                      {typeof stat.value === 'number'
                        ? (stat.format === 'currency' ? formatCurrency(stat.value) : formatNumber(stat.value))
                        : stat.value}
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
                      <stop offset="5%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="hsl(221.2 83.2% 53.3%)" stopOpacity={0} />
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
