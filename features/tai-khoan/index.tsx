import React, { useState, useMemo } from 'react';
import { GenericListView } from '../../shared/components/GenericListView';
import { useTaiKhoanList } from './hooks/use-tai-khoan-queries';
import { useTyGiaList } from '../ty-gia/hooks/use-ty-gia-queries';
import TaiKhoanTable from './components/tai-khoan-table';
import TaiKhoanFormView from './components/tai-khoan-form-view';
import TaiKhoanDetailView from './components/tai-khoan-detail-view';
import ConfirmModal from '../../components/common/ConfirmModal';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import { TaiKhoan, TaiKhoanInput } from './core/types';
import { taiKhoanService } from './services/tai-khoan-service';
import { toast } from 'sonner';
import { Wallet, Landmark, TrendingUp, Edit, Trash2, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../shared/utils/format';
import { useAuthStore } from '../../store/auth-store';
import { cn } from '../../lib/utils';

const formatUSD = (val: number | null | undefined) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

const TaiKhoanModule: React.FC = () => {
  const { profile } = useAuthStore();
  const { data, isLoading, refetch } = useTaiKhoanList();
  const { data: tyGiaList } = useTyGiaList();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TaiKhoan | null>(null);
  const [detailItem, setDetailItem] = useState<TaiKhoan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: TaiKhoan) => {
    setSelectedItem(item);
    setDetailItem(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData: TaiKhoanInput) => {
    setIsActionLoading(true);
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (selectedItem) {
        await taiKhoanService.update(selectedItem.id, payload);
        toast.success('Cập nhật tài khoản thành công!');
      } else {
        await taiKhoanService.create(payload);
        toast.success('Thêm tài khoản mới thành công!');
      }
      handleCancelForm();
      refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsActionLoading(true);
    try {
      await taiKhoanService.delete(deleteId);
      toast.success('Đã xóa tài khoản!');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // FIX: Provide a default structure for the summary object to prevent runtime errors when data is not yet available.
  const { summary } = useMemo(() => {
    const initialSummary = {
      vnd: { dau_ky: 0, thu: 0, chi: 0 },
      usd: { dau_ky: 0, thu: 0, chi: 0 },
    };

    if (!data) return { summary: initialSummary };

    const totals = data.reduce((acc, tk) => {
      if (tk.don_vi === 'VND') {
        acc.vnd.dau_ky += tk.so_du_dau_ky || 0;
        acc.vnd.thu += tk.tong_thu || 0;
        acc.vnd.chi += tk.tong_chi || 0;
      } else if (tk.don_vi === 'USD') {
        acc.usd.dau_ky += tk.so_du_dau_ky || 0;
        acc.usd.thu += tk.tong_thu || 0;
        acc.usd.chi += tk.tong_chi || 0;
      }
      return acc;
    }, initialSummary);

    return { summary: totals };
  }, [data]);

  const so_du_cuoi_vnd = summary.vnd.dau_ky + summary.vnd.thu - summary.vnd.chi;
  const so_du_cuoi_usd = summary.usd.dau_ky + summary.usd.thu - summary.usd.chi;
  const latestRate = tyGiaList?.[0]?.ty_gia || 0;
  const tongTaiSanQuyDoiVND = so_du_cuoi_vnd + (so_du_cuoi_usd * latestRate);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50 flex flex-col justify-between">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Tổng tài sản (Quy đổi VND)</p>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(tongTaiSanQuyDoiVND)}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Dựa trên tỷ giá mới nhất: {new Intl.NumberFormat('vi-VN').format(latestRate)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tổng quỹ VND</p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-xs">VND</div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-4">{formatCurrency(so_du_cuoi_vnd)}</h3>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-[10px] text-center">
            <div><p className="font-bold text-slate-400 uppercase">Đầu kỳ</p><p className="font-medium text-slate-600 mt-0.5">{formatCurrency(summary.vnd.dau_ky)}</p></div>
            <div><p className="font-bold text-emerald-500 uppercase">Tổng thu</p><p className="font-medium text-emerald-600 mt-0.5">{formatCurrency(summary.vnd.thu)}</p></div>
            <div><p className="font-bold text-rose-500 uppercase">Tổng chi</p><p className="font-medium text-rose-600 mt-0.5">{formatCurrency(summary.vnd.chi)}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50 flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tổng quỹ USD</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">USD</div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-4">{formatUSD(so_du_cuoi_usd)}</h3>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-[10px] text-center">
            <div><p className="font-bold text-slate-400 uppercase">Đầu kỳ</p><p className="font-medium text-slate-600 mt-0.5">{formatUSD(summary.usd.dau_ky)}</p></div>
            <div><p className="font-bold text-emerald-500 uppercase">Tổng thu</p><p className="font-medium text-emerald-600 mt-0.5">{formatUSD(summary.usd.thu)}</p></div>
            <div><p className="font-bold text-rose-500 uppercase">Tổng chi</p><p className="font-medium text-rose-600 mt-0.5">{formatUSD(summary.usd.chi)}</p></div>
          </div>
        </div>
      </div>

      <GenericListView<TaiKhoan>
        title="Danh mục Tài khoản"
        description="Quản lý toàn bộ nguồn tiền mặt, tài khoản ngân hàng và các quỹ tài chính của doanh nghiệp."
        data={data}
        isLoading={isLoading}
        searchKey="ten_tai_khoan"
        onAdd={handleAdd}
        renderTable={(filteredData) => (
          <TaiKhoanTable
            data={filteredData}
            onEdit={handleEdit}
            onView={(item) => setDetailItem(item)}
            onDelete={(item) => setDeleteId(item.id)}
          />
        )}
      />

      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Chi tiết tài khoản"
        description={detailItem?.loai_tai_khoan === 'tien_mat' ? 'Quỹ tiền mặt nội bộ' : 'Tài khoản ngân hàng'}
        footer={
          detailItem && (
            <div className="flex w-full items-center justify-between">
              <Button variant="outline" onClick={() => setDetailItem(null)}>Đóng</Button>
              <div className="flex items-center gap-3">
                <Button onClick={() => handleEdit(detailItem)} className="gap-2"> <Edit size={16} /> Sửa </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setDeleteId(detailItem.id);
                    setDetailItem(null);
                  }}
                  className="gap-2"
                > <Trash2 size={16} /> Xóa </Button>
              </div>
            </div>
          )
        }
      >
        {detailItem && <TaiKhoanDetailView data={detailItem} />}
      </Sheet>

      <Sheet
        isOpen={isFormOpen}
        onClose={handleCancelForm}
        title={selectedItem ? "Cập nhật tài khoản" : "Khởi tạo tài khoản tài chính"}
        description="Quản lý dòng tiền bắt đầu bằng việc thiết lập các quỹ và tài khoản ngân hàng chính xác."
      >
        <TaiKhoanFormView
          key={selectedItem?.id}
          initialData={selectedItem ? {
            ...selectedItem,
            so_du_dau_ky: selectedItem?.so_du_dau_ky,
          } as TaiKhoanInput : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xác nhận xóa tài khoản"
        message="Hành động này sẽ xóa hoàn toàn thông tin tài khoản. Nếu tài khoản đã phát sinh giao dịch, hãy cân nhắc chuyển trạng thái sang Ngừng hoạt động thay vì xóa."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default TaiKhoanModule;
