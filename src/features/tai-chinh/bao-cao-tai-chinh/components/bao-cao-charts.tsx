import {
  GenericLineChart,
  GenericBarChart,
  GenericPieChart,
  GenericAreaChart,
} from '@/components/charts'
import type { ChartConfig } from '@/components/ui/chart'
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
      <GenericLineChart
        title="Xu hướng thời gian"
        icon={<TrendingUp className="h-4 w-4" />}
        data={timeChartData}
        xKey="period"
        yKeys={[
          { key: 'tongThu', label: 'Tổng thu', color: 'hsl(142 76% 36%)' },
          { key: 'tongChi', label: 'Tổng chi', color: 'hsl(0 84% 60%)' },
          { key: 'soDu', label: 'Số dư', color: 'hsl(221 83% 53%)', strokeDasharray: '5 5' },
        ]}
        config={chartConfig}
        height="200px"
      />

      {/* Time Series - Bar Chart */}
      <GenericBarChart
        title="So sánh thu chi"
        icon={<BarChart3 className="h-4 w-4" />}
        data={timeChartData}
        xKey="period"
        yKeys={[
          { key: 'tongThu', label: 'Tổng thu', color: 'hsl(142 76% 36%)', radius: [4, 4, 0, 0] },
          { key: 'tongChi', label: 'Tổng chi', color: 'hsl(0 84% 60%)', radius: [4, 4, 0, 0] },
        ]}
        config={chartConfig}
        height="200px"
      />

      {/* Top Categories - Pie Chart */}
      <GenericPieChart
        title="Top 5 Danh mục"
        icon={<PieChartIcon className="h-4 w-4" />}
        data={categoryPieData}
        colors={COLORS}
        config={chartConfig}
        height="200px"
      />

      {/* Top Partners - Pie Chart */}
      <GenericPieChart
        title="Top 5 Đối tác"
        icon={<PieChartIcon className="h-4 w-4" />}
        data={partnerPieData}
        colors={COLORS}
        config={chartConfig}
        height="200px"
      />

      {/* Categories - Bar Chart */}
      <GenericBarChart
        title="Top Danh mục"
        icon={<BarChart3 className="h-4 w-4" />}
        data={categoryBarData}
        xKey="name"
        yKeys={[
          { key: 'tongThu', label: 'Tổng thu', color: 'hsl(142 76% 36%)', radius: [0, 4, 4, 0] },
          { key: 'tongChi', label: 'Tổng chi', color: 'hsl(0 84% 60%)', radius: [0, 4, 4, 0] },
        ]}
        config={chartConfig}
        height="200px"
        orientation="horizontal"
      />

      {/* Partners - Bar Chart */}
      <GenericBarChart
        title="Top Đối tác"
        icon={<BarChart3 className="h-4 w-4" />}
        data={partnerBarData}
        xKey="name"
        yKeys={[
          { key: 'tongThu', label: 'Tổng thu', color: 'hsl(142 76% 36%)', radius: [0, 4, 4, 0] },
          { key: 'tongChi', label: 'Tổng chi', color: 'hsl(0 84% 60%)', radius: [0, 4, 4, 0] },
        ]}
        config={chartConfig}
        height="200px"
        orientation="horizontal"
      />

      {/* Chart 4: Phát sinh tiền theo ngày */}
      <GenericBarChart
        title="Phát sinh theo ngày"
        icon={<Calendar className="h-4 w-4" />}
        data={phatSinhTheoNgay}
        xKey="ngay"
        yKeys={[
          { key: 'tongTien', label: 'Phát sinh', color: 'hsl(217 91% 65%)', radius: [4, 4, 0, 0] },
        ]}
        config={chartConfig}
        height="200px"
        xAxisAngle={-45}
        xAxisHeight={60}
      />

      {/* Chart 5: Tỷ lệ Thu/Chi */}
      <GenericPieChart
        title="Tỷ lệ Thu/Chi"
        icon={<Wallet className="h-4 w-4" />}
        data={tyLeThuChi}
        colors={['hsl(142 76% 36%)', 'hsl(0 84% 60%)']}
        config={chartConfig}
        height="200px"
        outerRadius={80}
        innerRadius={60}
        paddingAngle={2}
        labelFormatter={(props: any) => {
          const name = props.name || ''
          const percent = props.percent || 0
          return `${name}: ${(percent * 100).toFixed(1)}%`
        }}
      />

      {/* Chart 6: Số dư tích lũy */}
      <GenericAreaChart
        title="Số dư tích lũy"
        icon={<TrendingUp className="h-4 w-4" />}
        data={soDuTichLuy}
        xKey="period"
        yKey="soDuTichLuy"
        label="Số dư tích lũy"
        color="hsl(142 76% 40%)"
        config={chartConfig}
        height="200px"
        fillOpacity={0.6}
      />
    </div>
  )
}
