import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import type {
  BaoCaoGroupedByTime,
  BaoCaoGroupedByDanhMuc,
  BaoCaoGroupedByDoiTac,
  TopItem,
} from '@/types/bao-cao-tai-chinh'
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar, Wallet } from 'lucide-react'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface BaoCaoChartsProps {
  groupedByTime?: BaoCaoGroupedByTime[]
  groupedByDanhMuc?: BaoCaoGroupedByDanhMuc[]
  groupedByDoiTac?: BaoCaoGroupedByDoiTac[]
  topDanhMuc?: TopItem[]
  topDoiTac?: TopItem[]
  giaoDich?: GiaoDichWithRelations[]
  summary?: { tongThu: number; tongChi: number }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

const chartConfig = {
  tongThu: {
    label: 'Tổng thu',
    theme: {
      light: '142 76% 36%',
      dark: '142 70% 50%',
    },
  },
  tongChi: {
    label: 'Tổng chi',
    theme: {
      light: '0 84% 60%',
      dark: '0 72% 55%',
    },
  },
  soDu: {
    label: 'Số dư',
    theme: {
      light: '221 83% 53%',
      dark: '217 91% 65%',
    },
  },
  value: {
    label: 'Giá trị',
    color: 'hsl(43 74% 66%)',
  },
  phatSinh: {
    label: 'Phát sinh',
    theme: {
      light: '217 91% 65%',
      dark: '217 91% 70%',
    },
  },
  soDuTichLuy: {
    label: 'Số dư tích lũy',
    theme: {
      light: '142 76% 40%',
      dark: '142 70% 50%',
    },
  },
} satisfies ChartConfig

const COLORS = [
  'hsl(12 76% 61%)',      // Orange
  'hsl(173 58% 45%)',     // Teal
  'hsl(43 74% 66%)',      // Yellow
  'hsl(280 65% 65%)',     // Purple
  'hsl(340 75% 60%)',     // Pink
  'hsl(217 91% 65%)',     // Blue
  'hsl(142 76% 40%)',     // Green
  'hsl(30 80% 60%)',      // Orange-Yellow
]

export function BaoCaoCharts({
  groupedByTime,
  groupedByDanhMuc,
  groupedByDoiTac,
  topDanhMuc,
  topDoiTac,
  giaoDich = [],
  summary,
}: BaoCaoChartsProps) {
  // Prepare data for time-based charts
  const timeChartData = groupedByTime?.map((item) => ({
    period: item.period,
    tongThu: item.tongThu,
    tongChi: item.tongChi,
    soDu: item.tongThu - item.tongChi,
  })) || []

  // Prepare data for category pie chart
  const categoryPieData = topDanhMuc?.slice(0, 5).map((item) => ({
    name: item.ten,
    value: item.tongTien,
  })) || []

  // Prepare data for partner pie chart
  const partnerPieData = topDoiTac?.slice(0, 5).map((item) => ({
    name: item.ten,
    value: item.tongTien,
  })) || []

  // Prepare data for category bar chart
  const categoryBarData = groupedByDanhMuc?.slice(0, 10).map((item) => ({
    name: item.danhMucTen,
    tongThu: item.tongThu,
    tongChi: item.tongChi,
  })) || []

  // Prepare data for partner bar chart
  const partnerBarData = groupedByDoiTac?.slice(0, 10).map((item) => ({
    name: item.doiTacTen,
    tongThu: item.tongThu,
    tongChi: item.tongChi,
  })) || []

  // 1. Phát sinh tiền theo ngày
  const phatSinhTheoNgay = useMemo(() => {
    if (!giaoDich || giaoDich.length === 0) return []
    
    const grouped = new Map<string, { ngay: string; ngaySort: string; tongTien: number }>()
    
    giaoDich.forEach((gd) => {
      const date = dayjs(gd.ngay)
      const ngay = date.format('DD/MM')
      const ngaySort = date.format('YYYY-MM-DD')
      const soTien = gd.so_tien_vnd || gd.so_tien
      
      if (!grouped.has(ngaySort)) {
        grouped.set(ngaySort, { ngay, ngaySort, tongTien: 0 })
      }
      
      grouped.get(ngaySort)!.tongTien += soTien
    })
    
    return Array.from(grouped.values())
      .sort((a, b) => a.ngaySort.localeCompare(b.ngaySort))
      .slice(-14) // Lấy 14 ngày gần nhất
      .map(({ ngay, tongTien }) => ({ ngay, tongTien }))
  }, [giaoDich])

  // 2. Tỷ lệ Thu/Chi
  const tyLeThuChi = useMemo(() => {
    if (!summary) return []
    const tong = summary.tongThu + summary.tongChi
    if (tong === 0) return []
    
    return [
      { name: 'Thu', value: summary.tongThu, percent: (summary.tongThu / tong) * 100 },
      { name: 'Chi', value: summary.tongChi, percent: (summary.tongChi / tong) * 100 },
    ]
  }, [summary])

  // 3. Số dư tích lũy theo thời gian
  const soDuTichLuy = useMemo(() => {
    if (!groupedByTime || groupedByTime.length === 0) return []
    
    let soDuTichLuy = 0
    return groupedByTime.map((item) => {
      soDuTichLuy += item.soDu
      return {
        period: item.period,
        soDuTichLuy,
      }
    })
  }, [groupedByTime])

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Time Series - Line Chart */}
      {timeChartData.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Xu hướng thời gian</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <LineChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="period"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="tongThu"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142 76% 36%)', r: 4 }}
                  activeDot={{ r: 6 }}
                  className="dark:stroke-[hsl(142_70%_50%)] [&_circle]:dark:fill-[hsl(142_70%_50%)]"
                />
                <Line
                  type="monotone"
                  dataKey="tongChi"
                  stroke="hsl(0 84% 60%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(0 84% 60%)', r: 4 }}
                  activeDot={{ r: 6 }}
                  className="dark:stroke-[hsl(0_72%_55%)] [&_circle]:dark:fill-[hsl(0_72%_55%)]"
                />
                <Line
                  type="monotone"
                  dataKey="soDu"
                  stroke="hsl(221 83% 53%)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(221 83% 53%)', r: 4 }}
                  activeDot={{ r: 6 }}
                  className="dark:stroke-[hsl(217_91%_65%)] [&_circle]:dark:fill-[hsl(217_91%_65%)]"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Time Series - Bar Chart */}
      {timeChartData.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">So sánh thu chi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <BarChart data={timeChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="period"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="tongThu" 
                  fill="hsl(142 76% 36%)" 
                  radius={[4, 4, 0, 0]}
                  className="dark:fill-[hsl(142_70%_50%)]"
                />
                <Bar 
                  dataKey="tongChi" 
                  fill="hsl(0 84% 60%)" 
                  radius={[4, 4, 0, 0]}
                  className="dark:fill-[hsl(0_72%_55%)]"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Categories - Pie Chart */}
      {categoryPieData.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Top 5 Danh mục</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const name = props.name || ''
                    const percent = props.percent || 0
                    return `${name}: ${(percent * 100).toFixed(0)}%`
                  }}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryPieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Partners - Pie Chart */}
      {partnerPieData.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Top 5 Đối tác</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <PieChart>
                <Pie
                  data={partnerPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const name = props.name || ''
                    const percent = props.percent || 0
                    return `${name}: ${(percent * 100).toFixed(0)}%`
                  }}
                  outerRadius={80}
                  dataKey="value"
                >
                  {partnerPieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Categories - Bar Chart */}
      {categoryBarData.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Top Danh mục</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <BarChart data={categoryBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="tongThu" 
                  fill="hsl(142 76% 36%)" 
                  radius={[0, 4, 4, 0]}
                  className="dark:fill-[hsl(142_70%_50%)]"
                />
                <Bar 
                  dataKey="tongChi" 
                  fill="hsl(0 84% 60%)" 
                  radius={[0, 4, 4, 0]}
                  className="dark:fill-[hsl(0_72%_55%)]"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Partners - Bar Chart */}
      {partnerBarData.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Top Đối tác</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <BarChart data={partnerBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="tongThu" 
                  fill="hsl(142 76% 36%)" 
                  radius={[0, 4, 4, 0]}
                  className="dark:fill-[hsl(142_70%_50%)]"
                />
                <Bar 
                  dataKey="tongChi" 
                  fill="hsl(0 84% 60%)" 
                  radius={[0, 4, 4, 0]}
                  className="dark:fill-[hsl(0_72%_55%)]"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Chart 4: Phát sinh tiền theo ngày */}
      {phatSinhTheoNgay.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Phát sinh theo ngày</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <BarChart data={phatSinhTheoNgay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="ngay"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="tongTien" 
                  fill="hsl(217 91% 65%)" 
                  radius={[4, 4, 0, 0]}
                  className="dark:fill-[hsl(217_91%_70%)]"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Chart 5: Tỷ lệ Thu/Chi */}
      {tyLeThuChi.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Tỷ lệ Thu/Chi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <PieChart>
                <Pie
                  data={tyLeThuChi}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={(props: any) => {
                    const name = props.name || ''
                    const percent = props.percent || 0
                    return `${name}: ${(percent * 100).toFixed(1)}%`
                  }}
                >
                  {tyLeThuChi.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Thu' ? 'hsl(142 76% 36%)' : 'hsl(0 84% 60%)'} 
                      className={entry.name === 'Thu' ? 'dark:fill-[hsl(142_70%_50%)]' : 'dark:fill-[hsl(0_72%_55%)]'}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Chart 6: Số dư tích lũy */}
      {soDuTichLuy.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm text-primary">Số dư tích lũy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[200px] w-full max-w-full">
              <AreaChart data={soDuTichLuy}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="period"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="soDuTichLuy"
                  stroke="hsl(142 76% 40%)"
                  fill="hsl(142 76% 40%)"
                  fillOpacity={0.6}
                  className="dark:stroke-[hsl(142_70%_50%)] dark:fill-[hsl(142_70%_50%)]"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
