import {
  GenericLineChart,
  GenericBarChart,
  GenericPieChart,
  GenericAreaChart,
  GenericChartsGrid,
} from '@/components/charts'
import type { ChartConfig } from '@/components/ui/chart'
import type {
  BaoCaoTaiKhoanGroupedByTime,
  BaoCaoTaiKhoanGroupedByTaiKhoan,
  BaoCaoTaiKhoanGroupedByLoaiTaiKhoan,
  BaoCaoTaiKhoanGroupedByLoaiTien,
} from '@/types/bao-cao-tai-khoan'
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar, Wallet } from 'lucide-react'
import type { BaoCaoTaiKhoanGiaoDich } from '@/types/bao-cao-tai-khoan'
import { useMemo } from 'react'

interface BaoCaoTaiKhoanChartsProps {
  groupedByTime?: BaoCaoTaiKhoanGroupedByTime[]
  groupedByTaiKhoan?: BaoCaoTaiKhoanGroupedByTaiKhoan[]
  groupedByLoaiTaiKhoan?: BaoCaoTaiKhoanGroupedByLoaiTaiKhoan[]
  groupedByLoaiTien?: BaoCaoTaiKhoanGroupedByLoaiTien[]
  giaoDich?: BaoCaoTaiKhoanGiaoDich[]
  summary?: { tongThu: number; tongChi: number; soDuDauKy: number; tonCuoi: number }
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
  tonCuoi: {
    label: 'Tồn cuối',
    theme: {
      light: '221 83% 53%',
      dark: '217 91% 65%',
    },
  },
  soDuTichLuy: {
    label: 'Số dư tích lũy',
    theme: {
      light: '142 76% 40%',
      dark: '142 70% 50%',
    },
  },
  phatSinh: {
    label: 'Phát sinh',
    theme: {
      light: '217 91% 65%',
      dark: '217 91% 70%',
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

export function BaoCaoTaiKhoanCharts({
  groupedByTime,
  groupedByTaiKhoan,
  groupedByLoaiTaiKhoan: _groupedByLoaiTaiKhoan,
  groupedByLoaiTien: _groupedByLoaiTien,
  giaoDich = [],
  summary,
}: BaoCaoTaiKhoanChartsProps) {
  // Prepare data for time-based charts
  const timeChartData = groupedByTime?.map((item) => ({
    period: item.period,
    tongThu: item.tongThu,
    tongChi: item.tongChi,
    tonCuoi: item.tonCuoi,
    soDuDauKy: item.soDuDauKy,
  })) || []

  // Prepare data for tai khoan pie chart (top 5)
  const taiKhoanPieData = groupedByTaiKhoan
    ?.slice(0, 5)
    .map((item) => ({
      name: item.taiKhoanTen,
      value: item.tonCuoi,
    })) || []

  // Prepare data for tai khoan bar chart (top 10)
  const taiKhoanBarData = groupedByTaiKhoan?.slice(0, 10).map((item) => ({
    name: item.taiKhoanTen.length > 15 ? item.taiKhoanTen.substring(0, 15) + '...' : item.taiKhoanTen,
    tongThu: item.tongThu,
    tongChi: item.tongChi,
    tonCuoi: item.tonCuoi,
  })) || []

  // 1. Phát sinh tiền theo ngày
  const phatSinhTheoNgay = useMemo(() => {
    if (!giaoDich || giaoDich.length === 0) return []
    
    const grouped = new Map<string, { ngay: string; tongTien: number }>()
    
    giaoDich.forEach((gd) => {
      const ngay = new Date(gd.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      const soTien = gd.so_tien_vnd || gd.so_tien || 0
      
      const existing = grouped.get(ngay) || { ngay, tongTien: 0 }
      existing.tongTien += soTien
      grouped.set(ngay, existing)
    })
    
    return Array.from(grouped.values())
      .sort((a, b) => a.ngay.localeCompare(b.ngay))
      .slice(-30) // Last 30 days
  }, [giaoDich])

  // 2. Tỷ lệ Thu/Chi
  const tyLeThuChi = useMemo(() => {
    if (!summary) return []
    return [
      { name: 'Thu', value: summary.tongThu },
      { name: 'Chi', value: summary.tongChi },
    ]
  }, [summary])

  // 3. Số dư tích lũy theo thời gian
  const soDuTichLuy = useMemo(() => {
    if (!groupedByTime || groupedByTime.length === 0) return []
    
    let runningSoDu = groupedByTime[0]?.soDuDauKy || 0
    return groupedByTime.map((item) => {
      runningSoDu = item.tonCuoi
      return {
        period: item.period,
        soDu: runningSoDu,
      }
    })
  }, [groupedByTime])

  return (
    <GenericChartsGrid maxCols={4}>
      {/* 1. Xu hướng Thu/Chi theo thời gian - Line Chart */}
      <GenericLineChart
        title="Xu hướng Thu/Chi theo thời gian"
        icon={<TrendingUp className="h-4 w-4" />}
        data={timeChartData}
        xKey="period"
        yKeys={[
          { key: 'tongThu', label: 'Tổng thu', color: 'hsl(142 76% 36%)' },
          { key: 'tongChi', label: 'Tổng chi', color: 'hsl(0 84% 60%)' },
        ]}
        config={chartConfig}
        xAxisAngle={-45}
        xAxisHeight={60}
        height="200px"
      />

      {/* 2. So sánh Thu/Chi - Bar Chart */}
      <GenericBarChart
        title="So sánh Thu/Chi theo kỳ"
        icon={<BarChart3 className="h-4 w-4" />}
        data={timeChartData}
        xKey="period"
        yKeys={[
          { key: 'tongThu', label: 'Tổng thu', color: 'hsl(142 76% 36%)' },
          { key: 'tongChi', label: 'Tổng chi', color: 'hsl(0 84% 60%)' },
        ]}
        config={chartConfig}
        xAxisAngle={-45}
        xAxisHeight={60}
        height="200px"
      />

      {/* 3. Phát sinh tiền theo ngày - Bar Chart */}
      <GenericBarChart
        title="Phát sinh tiền theo ngày"
        icon={<Calendar className="h-4 w-4" />}
        data={phatSinhTheoNgay}
        xKey="ngay"
        yKeys={[
          { key: 'tongTien', label: 'Phát sinh', color: 'hsl(217 91% 65%)' },
        ]}
        config={chartConfig}
        xAxisAngle={-45}
        xAxisHeight={60}
        height="200px"
      />

      {/* 4. Tỷ lệ Thu/Chi - Pie Chart */}
      <GenericPieChart
        title="Tỷ lệ Thu/Chi"
        icon={<PieChartIcon className="h-4 w-4" />}
        data={tyLeThuChi}
        colors={['hsl(142 76% 36%)', 'hsl(0 84% 60%)']}
        config={chartConfig}
        labelFormatter={({ name, percent }) => {
          if (percent === undefined) return ''
          return `${name}: ${(percent * 100).toFixed(1)}%`
        }}
        height="200px"
      />

      {/* 5. Phân bổ theo tài khoản - Pie Chart (Top 5) */}
      <GenericPieChart
        title="Phân bổ theo tài khoản (Top 5)"
        icon={<PieChartIcon className="h-4 w-4" />}
        data={taiKhoanPieData}
        colors={COLORS}
        config={chartConfig}
        height="200px"
      />

      {/* 6. Top 10 tài khoản - Horizontal Bar Chart */}
      <GenericBarChart
        title="Top 10 tài khoản"
        icon={<BarChart3 className="h-4 w-4" />}
        data={taiKhoanBarData}
        xKey="name"
        yKeys={[
          { key: 'tonCuoi', label: 'Tồn cuối', color: 'hsl(221 83% 53%)' },
        ]}
        config={chartConfig}
        orientation="horizontal"
        height="200px"
      />

      {/* 7. Số dư tích lũy - Area Chart */}
      <GenericAreaChart
        title="Số dư tích lũy"
        icon={<Wallet className="h-4 w-4" />}
        data={soDuTichLuy}
        xKey="period"
        yKey="soDu"
        label="Số dư"
        color="hsl(142 76% 40%)"
        config={chartConfig}
        xAxisAngle={-45}
        xAxisHeight={60}
        height="200px"
      />
    </GenericChartsGrid>
  )
}

