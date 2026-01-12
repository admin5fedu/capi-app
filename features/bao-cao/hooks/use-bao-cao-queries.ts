
import { useMemo } from 'react';
import { useGiaoDichList } from '../../giao-dich/hooks/use-giao-dich-queries';
import { useTaiKhoanList } from '../../tai-khoan/hooks/use-tai-khoan-queries';
import { useKhachHangList } from '../../khach-hang/hooks/use-khach-hang-queries';
import { useNCCList } from '../../nha-cung-cap/hooks/use-nha-cung-cap-queries';
import { useDanhMucTaiChinhList } from '../../danh-muc-tai-chinh/hooks/use-danh-muc-tai-chinh-queries';
import { 
  CashFlowReportData, 
  CashFlowDataPoint, 
  LedgerReportData, 
  LedgerDataPoint,
  DoiTacReportData,
  DoiTacReportDataPoint,
  ChiPhiHangMucReportData,
  HangMucReportDataPoint,
  LaiLoReportData,
  PnlBreakdownItem
} from '../core/types';
import { GiaoDich } from '../../giao-dich/core/types';
import { DanhMucTaiChinh } from '../../danh-muc-tai-chinh/core/types';

export function useBaoCaoDongTien(startDate: Date, endDate: Date) {
  const { data: transactions, isLoading, error } = useGiaoDichList();

  const reportData: CashFlowReportData | null = useMemo(() => {
    if (!transactions) return null;

    const filteredTransactions = transactions.filter(t => {
      if (!t.ngay) return false;
      const transactionDate = new Date(t.ngay);
      transactionDate.setHours(0, 0, 0, 0);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const dailyData: { [key: string]: { thu: number; chi: number } } = {};

    let totalThu = 0;
    let totalChi = 0;

    filteredTransactions.forEach((t: GiaoDich) => {
      const dateStr = t.ngay!.split('T')[0];
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { thu: 0, chi: 0 };
      }

      if (t.hang_muc === 'thu') {
        const amount = t.so_tien_quy_doi_den || t.so_tien || 0;
        dailyData[dateStr].thu += amount;
        totalThu += amount;
      } else if (t.hang_muc === 'chi') {
        const amount = t.so_tien_quy_doi_di || t.so_tien || 0;
        dailyData[dateStr].chi += amount;
        totalChi += amount;
      }
    });
    
    const chartData: CashFlowDataPoint[] = Object.entries(dailyData)
      .map(([date, values]) => ({
        date,
        thu: values.thu,
        chi: values.chi,
        net: values.thu - values.chi,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
    return {
      chartData,
      totalThu,
      totalChi,
      netFlow: totalThu - totalChi,
      filteredTransactions,
    };
  }, [transactions, startDate, endDate]);

  return {
    data: reportData,
    isLoading,
    error,
  };
}


export function useBaoCaoSoQuy(accountId: number | null, startDate: Date, endDate: Date) {
  const { data: transactions, isLoading: isGiaoDichLoading } = useGiaoDichList();
  const { data: accounts, isLoading: isTaiKhoanLoading } = useTaiKhoanList();

  const reportData: LedgerReportData | null = useMemo(() => {
    if (!transactions || !accounts || !accountId) return null;

    const selectedAccount = accounts.find(acc => acc.id === accountId);
    if (!selectedAccount) return null;

    // 1. Tính số dư đầu kỳ
    const openingBalance = (selectedAccount.so_du_dau_ky || 0) + transactions
      .filter(t => {
        if (!t.ngay) return false;
        const transactionDate = new Date(t.ngay);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate < startDate && (t.tai_khoan_di_id === accountId || t.tai_khoan_den_id === accountId);
      })
      .reduce((balance, t) => {
        if (t.tai_khoan_den_id === accountId) return balance + (t.so_tien || 0);
        if (t.tai_khoan_di_id === accountId) return balance - (t.so_tien || 0);
        return balance;
      }, 0);

    // 2. Lọc và sắp xếp giao dịch trong kỳ
    const periodTransactions = transactions
      .filter(t => {
        if (!t.ngay) return false;
        const transactionDate = new Date(t.ngay);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate >= startDate && transactionDate <= endDate && (t.tai_khoan_di_id === accountId || t.tai_khoan_den_id === accountId);
      })
      .sort((a, b) => new Date(a.ngay!).getTime() - new Date(b.ngay!).getTime() || a.id - b.id);

    // 3. Xây dựng dữ liệu sổ quỹ với số dư chạy
    let currentBalance = openingBalance;
    let tongThuTrongKy = 0;
    let tongChiTrongKy = 0;

    const ledgerData: LedgerDataPoint[] = periodTransactions.map(t => {
      const soTien = t.so_tien || 0;
      const isIncoming = t.tai_khoan_den_id === accountId;
      const thu = isIncoming ? soTien : 0;
      const chi = !isIncoming ? soTien : 0;
      
      currentBalance += thu - chi;
      tongThuTrongKy += thu;
      tongChiTrongKy += chi;

      return {
        id: t.id,
        ngay: t.ngay!,
        chung_tu: t.chung_tu,
        mo_ta: t.mo_ta || '',
        thu,
        chi,
        ton_cuoi: currentBalance,
      };
    });

    return {
      soDuDauKy: openingBalance,
      tongThuTrongKy,
      tongChiTrongKy,
      soDuCuoiKy: currentBalance,
      ledgerData,
      accountDetails: selectedAccount,
    };
  }, [transactions, accounts, accountId, startDate, endDate]);
  
  return {
    data: reportData,
    isLoading: isGiaoDichLoading || isTaiKhoanLoading,
  };
}

// BÁO CÁO DOANH THU THEO KHÁCH HÀNG
export function useBaoCaoDoanhThuTheoKH(startDate: Date, endDate: Date, nhomKHId: number | null) {
  const { data: transactions, isLoading: isGiaoDichLoading } = useGiaoDichList();
  const { data: khachHangList, isLoading: isKHLoading } = useKhachHangList();

  const reportData: DoiTacReportData | null = useMemo(() => {
    if (!transactions || !khachHangList) return null;

    let customerIdsInGroup: number[] | null = null;
    if (nhomKHId) {
        customerIdsInGroup = khachHangList
            .filter(kh => kh.nhom_doi_tac_id === nhomKHId)
            .map(kh => kh.id);
    }
    
    const revenueByCustomer: { [key: number]: { name: string; value: number } } = {};
    let total = 0;

    transactions.forEach(t => {
      const transactionDate = new Date(t.ngay!);
      transactionDate.setHours(0,0,0,0);
      
      if (
        t.hang_muc === 'thu' &&
        t.doi_tac_id &&
        transactionDate >= startDate &&
        transactionDate <= endDate &&
        (!customerIdsInGroup || customerIdsInGroup.includes(t.doi_tac_id))
      ) {
        const amount = t.so_tien_quy_doi_den || 0;
        if (!revenueByCustomer[t.doi_tac_id]) {
          revenueByCustomer[t.doi_tac_id] = { name: t.ten_doi_tac || `Đối tác #${t.doi_tac_id}`, value: 0 };
        }
        revenueByCustomer[t.doi_tac_id].value += amount;
        total += amount;
      }
    });

    const tableData: DoiTacReportDataPoint[] = Object.entries(revenueByCustomer)
      .map(([id, data]) => ({ id: Number(id), ...data }))
      .sort((a, b) => b.value - a.value);

    // For Bar Chart: Top 10 reversed for correct display order in Recharts
    const chartData = tableData.slice(0, 10).reverse();

    return { chartData, tableData, total };
  }, [transactions, khachHangList, startDate, endDate, nhomKHId]);

  return { data: reportData, isLoading: isGiaoDichLoading || isKHLoading };
}

// BÁO CÁO CHI PHÍ THEO NHÀ CUNG CẤP
export function useBaoCaoChiPhiTheoNCC(startDate: Date, endDate: Date, nhomNCCId: number | null) {
    const { data: transactions, isLoading: isGiaoDichLoading } = useGiaoDichList();
    const { data: nccList, isLoading: isNCCLoading } = useNCCList();

    const reportData: DoiTacReportData | null = useMemo(() => {
        if (!transactions || !nccList) return null;
        
        let nccIdsInGroup: number[] | null = null;
        if (nhomNCCId) {
            nccIdsInGroup = nccList
                .filter(ncc => ncc.nhom_doi_tac_id === nhomNCCId)
                .map(ncc => ncc.id);
        }

        const costBySupplier: { [key: number]: { name: string; value: number } } = {};
        let total = 0;

        transactions.forEach(t => {
            const transactionDate = new Date(t.ngay!);
            transactionDate.setHours(0, 0, 0, 0);
            
            if (
                t.hang_muc === 'chi' &&
                t.doi_tac_id &&
                transactionDate >= startDate &&
                transactionDate <= endDate &&
                (!nccIdsInGroup || nccIdsInGroup.includes(t.doi_tac_id))
            ) {
                const amount = t.so_tien_quy_doi_di || 0;
                if (!costBySupplier[t.doi_tac_id]) {
                    costBySupplier[t.doi_tac_id] = { name: t.ten_doi_tac || `Đối tác #${t.doi_tac_id}`, value: 0 };
                }
                costBySupplier[t.doi_tac_id].value += amount;
                total += amount;
            }
        });

        const tableData: DoiTacReportDataPoint[] = Object.entries(costBySupplier)
            .map(([id, data]) => ({ id: Number(id), ...data }))
            .sort((a, b) => b.value - a.value);
        
        const chartData = tableData.slice(0, 10).reverse();

        return { chartData, tableData, total };
    }, [transactions, nccList, startDate, endDate, nhomNCCId]);

    return { data: reportData, isLoading: isGiaoDichLoading || isNCCLoading };
}


// BÁO CÁO CHI PHÍ THEO HẠNG MỤC
export function useBaoCaoChiPhiTheoHangMuc(startDate: Date, endDate: Date, taiKhoanId: number | null) {
    const { data: transactions, isLoading: isGiaoDichLoading } = useGiaoDichList();
    const { data: danhMucList, isLoading: isDMLoading } = useDanhMucTaiChinhList();

    const reportData: ChiPhiHangMucReportData | null = useMemo(() => {
        if (!transactions || !danhMucList) return null;

        const costByCategory: { [key: number]: number } = {};
        let total = 0;

        transactions.forEach(t => {
            const transactionDate = new Date(t.ngay!);
            transactionDate.setHours(0, 0, 0, 0);

            if (
                t.hang_muc === 'chi' &&
                t.danh_muc_id &&
                transactionDate >= startDate &&
                transactionDate <= endDate &&
                (!taiKhoanId || t.tai_khoan_di_id === taiKhoanId)
            ) {
                const amount = t.so_tien_quy_doi_di || 0;
                costByCategory[t.danh_muc_id] = (costByCategory[t.danh_muc_id] || 0) + amount;
                total += amount;
            }
        });

        const danhMucMap = new Map<number, DanhMucTaiChinh>(danhMucList.map(dm => [dm.id, dm]));
        const tree: HangMucReportDataPoint[] = [];
        const treeMap = new Map<number, HangMucReportDataPoint>();

        danhMucList.forEach(dm => {
            if (dm.hang_muc !== 'chi') return;
            const totalValue = costByCategory[dm.id] || 0;
            const node: HangMucReportDataPoint = { id: dm.id, name: dm.ten_danh_muc!, value: totalValue, children: [] };
            treeMap.set(dm.id, node);
        });
        
        treeMap.forEach(node => {
            const dm = danhMucMap.get(Number(node.id))!;
            if (dm.danh_muc_cha_id && treeMap.has(dm.danh_muc_cha_id)) {
                const parent = treeMap.get(dm.danh_muc_cha_id)!;
                parent.children!.push(node);
                parent.value += node.value;
            } else {
                tree.push(node);
            }
        });
        
        const filteredTree = tree.filter(node => node.value > 0).sort((a,b) => b.value - a.value);
        
        const pieChartData = filteredTree.map(node => ({
            id: node.id,
            name: node.name,
            value: node.value,
        }));

        return { pieChartData, treeData: filteredTree, total };
    }, [transactions, danhMucList, startDate, endDate, taiKhoanId]);
    
    return { data: reportData, isLoading: isGiaoDichLoading || isDMLoading };
}

// BÁO CÁO LÃI/LỖ
export function useBaoCaoLaiLo(startDate: Date, endDate: Date) {
  const { data: transactions, isLoading } = useGiaoDichList();

  const reportData: LaiLoReportData | null = useMemo(() => {
    if (!transactions) return null;

    let totalRevenue = 0;
    let totalExpenses = 0;
    const revenueByCategory: { [key: string]: number } = {};
    const expenseByCategory: { [key: string]: number } = {};

    transactions.forEach(t => {
      const transactionDate = new Date(t.ngay!);
      transactionDate.setHours(0, 0, 0, 0);

      if (transactionDate >= startDate && transactionDate <= endDate) {
        if (t.hang_muc === 'thu' && t.danh_muc_id) {
          const amount = t.so_tien_quy_doi_den || 0;
          const categoryName = t.ten_danh_muc_cha || t.ten_danh_muc || 'Doanh thu khác';
          revenueByCategory[categoryName] = (revenueByCategory[categoryName] || 0) + amount;
          totalRevenue += amount;
        } else if (t.hang_muc === 'chi' && t.danh_muc_id) {
          const amount = t.so_tien_quy_doi_di || 0;
          const categoryName = t.ten_danh_muc_cha || t.ten_danh_muc || 'Chi phí khác';
          expenseByCategory[categoryName] = (expenseByCategory[categoryName] || 0) + amount;
          totalExpenses += amount;
        }
      }
    });

    const revenueBreakdown: PnlBreakdownItem[] = Object.entries(revenueByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const expenseBreakdown: PnlBreakdownItem[] = Object.entries(expenseByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      revenueBreakdown,
      expenseBreakdown,
    };
  }, [transactions, startDate, endDate]);

  return { data: reportData, isLoading };
}
