
import { GiaoDich } from '../../giao-dich/core/types';

export interface CashFlowDataPoint {
  date: string;
  thu: number;
  chi: number;
  net: number;
}

export interface CashFlowReportData {
  chartData: CashFlowDataPoint[];
  totalThu: number;
  totalChi: number;
  netFlow: number;
  filteredTransactions: GiaoDich[];
}

export interface LedgerDataPoint {
  id: number;
  ngay: string;
  chung_tu: string | null;
  mo_ta: string;
  thu: number;
  chi: number;
  ton_cuoi: number;
}

export interface LedgerReportData {
  soDuDauKy: number;
  tongThuTrongKy: number;
  tongChiTrongKy: number;
  soDuCuoiKy: number;
  ledgerData: LedgerDataPoint[];
  accountDetails: any; 
}

// Báo cáo theo Đối tác (KH/NCC)
export interface DoiTacReportDataPoint {
  id: number | string;
  name: string;
  value: number;
}
export interface DoiTacReportData {
  chartData: DoiTacReportDataPoint[];
  tableData: DoiTacReportDataPoint[];
  total: number;
}

// Báo cáo theo Hạng mục chi phí
export interface HangMucReportDataPoint {
  id: number | string;
  name: string;
  value: number;
  children?: HangMucReportDataPoint[];
}
export interface ChiPhiHangMucReportData {
  pieChartData: DoiTacReportDataPoint[];
  treeData: HangMucReportDataPoint[];
  total: number;
}

// Báo cáo Lãi/Lỗ
export interface PnlBreakdownItem {
  name: string;
  value: number;
}

export interface LaiLoReportData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueBreakdown: PnlBreakdownItem[];
  expenseBreakdown: PnlBreakdownItem[];
}
