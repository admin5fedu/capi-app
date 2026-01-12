import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { GenericListView } from '../../shared/components/GenericListView';
import { useGiaoDichList } from './hooks/use-giao-dich-queries';
import { useTaiKhoanList } from '../tai-khoan/hooks/use-tai-khoan-queries';
import { useTyGiaList } from '../ty-gia/hooks/use-ty-gia-queries';
import { TAI_KHOAN_QUERY_KEY } from '../tai-khoan/hooks/use-tai-khoan-queries';
import { TY_GIA_QUERY_KEY } from '../ty-gia/hooks/use-ty-gia-queries';
import GiaoDichTable from './components/giao-dich-table';
import GiaoDichFormView from './components/giao-dich-form-view';
import GiaoDichDetailView from './components/giao-dich-detail-view';
import ConfirmModal from '../../components/common/ConfirmModal';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import { GiaoDich, GiaoDichInput, HangMucGiaoDich } from './core/types';
import { giaoDichService } from './services/giao-dich-service';
import { toast } from 'sonner';
import { Edit, Trash2, ArrowUp, ArrowDown, ArrowRightLeft, List } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth-store';
import { formatCurrency } from '../../shared/utils/format';

type ActiveTab = 'all' | 'thu' | 'chi' | 'chuyen_tien';

const GiaoDichModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const { profile } = useAuthStore();
  const { data, isLoading, refetch } = useGiaoDichList();
  const { data: taiKhoanList } = useTaiKhoanList();
  const { data: tyGiaList } = useTyGiaList();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GiaoDich | null>(null);
  const [detailItem, setDetailItem] = useState<GiaoDich | null>(null);
  const [deleteItem, setDeleteItem] = useState<GiaoDich | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const filteredData = useMemo(() => {
    if (activeTab === 'all') return data;
    return data?.filter(gd => gd.hang_muc === activeTab);
  }, [data, activeTab]);

  const { summary } = useMemo(() => {
    const initialSummary = {
      totalThuVND: 0,
      totalChiVND: 0,
      rawTotals: {
        VND: { thu: 0, chi: 0 },
        USD: { thu: 0, chi: 0 },
      },
    };
    if (!taiKhoanList) return { summary: initialSummary };
    
    const latestRate = tyGiaList?.[0]?.ty_gia || 0;

    const summary = taiKhoanList.reduce((acc, tk) => {
      const isUSD = tk.don_vi === 'USD';
      const thu = tk.tong_thu || 0;
      const chi = tk.tong_chi || 0;
      
      if (isUSD) {
        acc.rawTotals.USD.thu += thu;
        acc.rawTotals.USD.chi += chi;
        acc.totalThuVND += thu * latestRate;
        acc.totalChiVND += chi * latestRate;
      } else {
        acc.rawTotals.VND.thu += thu;
        acc.rawTotals.VND.chi += chi;
        acc.totalThuVND += thu;
        acc.totalChiVND += chi;
      }
      return acc;
    }, initialSummary);
    
    return { summary };
  }, [taiKhoanList, tyGiaList]);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: GiaoDich) => {
    setSelectedItem(item);
    setDetailItem(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData: GiaoDichInput) => {
    setIsActionLoading(true);
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (selectedItem) {
        await giaoDichService.update(selectedItem.id, payload);
        toast.success('Cập nhật giao dịch thành công!');
      } else {
        await giaoDichService.create(payload);
        toast.success('Thêm giao dịch mới thành công!');
      }
      handleCancelForm();
      refetch();
      queryClient.invalidateQueries({ queryKey: [TAI_KHOAN_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TY_GIA_QUERY_KEY] });
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setIsActionLoading(true);
    try {
      await giaoDichService.delete(deleteItem.id);
      toast.success('Đã xóa giao dịch!');
      setDeleteItem(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: [TAI_KHOAN_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TY_GIA_QUERY_KEY] });
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };
  
  const formatRawTotal = (raw: {VND: number, USD: number}) => {
    const parts = [];
    if (raw.VND > 0) parts.push(new Intl.NumberFormat('vi-VN').format(raw.VND) + ' VND');
    if (raw.USD > 0) parts.push(new Intl.NumberFormat('en-US').format(raw.USD) + ' USD');
    return parts.length > 0 ? `Bao gồm: ${parts.join(' & ')}` : 'Chưa có giao dịch';
  };


  const TABS: { id: ActiveTab, label: string, icon: React.ElementType }[] = [
    { id: 'all', label: 'Tất cả', icon: List },
    { id: 'thu', label: 'Thu', icon: ArrowDown },
    { id: 'chi', label: 'Chi', icon: ArrowUp },
    { id: 'chuyen_tien', label: 'Chuyển tiền', icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Tổng thu (Quy đổi VND)</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(summary.totalThuVND)}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">{formatRawTotal({ VND: summary.rawTotals.VND.thu, USD: summary.rawTotals.USD.thu })}</p>
          </div>
           <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Tổng chi (Quy đổi VND)</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(summary.totalChiVND)}</h3>
             <p className="text-[11px] text-slate-400 font-medium mt-1">{formatRawTotal({ VND: summary.rawTotals.VND.chi, USD: summary.rawTotals.USD.chi })}</p>
          </div>
           <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">Chênh lệch (VND)</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(summary.totalThuVND - summary.totalChiVND)}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Dựa trên tổng thu và chi đã quy đổi.</p>
          </div>
      </div>
      
      <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit border border-slate-200/50 shadow-sm">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id ? "bg-white text-primary shadow-soft" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <GenericListView<GiaoDich>
        title="Sổ quỹ & Giao dịch"
        description="Ghi nhận và quản lý mọi dòng tiền ra vào của doanh nghiệp."
        data={filteredData}
        isLoading={isLoading}
        searchKey="mo_ta"
        onAdd={handleAdd}
        renderTable={(d) => (
          <GiaoDichTable 
            data={d} 
            onEdit={handleEdit}
            onView={setDetailItem}
            onDelete={(item) => setDeleteItem(item)}
          />
        )}
      />

      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Chi tiết giao dịch"
        description={`ID: #${detailItem?.id} - Loại: ${detailItem?.hang_muc}`}
        footer={
          detailItem && (
            <div className="flex w-full items-center justify-between">
              <Button variant="outline" onClick={() => setDetailItem(null)}>Đóng</Button>
              <div className="flex items-center gap-3">
                <Button onClick={() => handleEdit(detailItem)} className="gap-2"> <Edit size={16} /> Sửa </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    setDeleteItem(detailItem);
                    setDetailItem(null);
                  }}
                  className="gap-2"
                > <Trash2 size={16} /> Xóa </Button>
              </div>
            </div>
          )
        }
      >
        {detailItem && <GiaoDichDetailView data={detailItem} />}
      </Sheet>

      <Sheet
        isOpen={isFormOpen}
        onClose={handleCancelForm}
        title={selectedItem ? "Cập nhật giao dịch" : "Thêm giao dịch mới"}
        description="Điền thông tin chi tiết để ghi nhận giao dịch vào hệ thống."
      >
        <GiaoDichFormView 
          key={selectedItem?.id}
          initialData={selectedItem as GiaoDichInput || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      <ConfirmModal 
        isOpen={!!deleteItem}
        title="Xác nhận xóa giao dịch"
        message="Hành động này sẽ xóa vĩnh viễn giao dịch và có thể ảnh hưởng đến số dư tài khoản. Bạn có chắc chắn không?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default GiaoDichModule;