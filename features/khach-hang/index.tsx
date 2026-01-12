
import React, { useState } from 'react';
import { GenericListView } from '../../shared/components/GenericListView';
import { useNhomKhachHangList, useKhachHangList } from './hooks/use-khach-hang-queries';
import NhomKHTable from './components/nhom-kh-table';
import NhomKHFormView from './components/nhom-kh-form-view';
import KHTable from './components/kh-table';
import KHFormView from './components/kh-form-view';
import KhachHangDetailView from './components/kh-detail-view';
import ConfirmModal from '../../components/common/ConfirmModal';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import { NhomDoiTac, NhomDoiTacInput, DoiTac, DoiTacInput } from './core/types';
import { khachHangService } from './services/khach-hang-service';
import { toast } from 'sonner';
import { Users, LayoutGrid, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth-store';

type ActiveTab = 'danh-sach' | 'nhom';

const KhachHangModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('danh-sach');
  const { profile } = useAuthStore();
  
  const nhomQuery = useNhomKhachHangList();
  const khQuery = useKhachHangList();
  
  const [isNhomFormOpen, setIsNhomFormOpen] = useState(false);
  const [isKHFormOpen, setIsKHFormOpen] = useState(false);
  const [selectedNhom, setSelectedNhom] = useState<NhomDoiTac | null>(null);
  const [selectedKH, setSelectedKH] = useState<DoiTac | null>(null);
  const [detailItem, setDetailItem] = useState<DoiTac | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
    
  // --- NHÓM KHÁCH HÀNG ---
  const handleAddNhom = () => {
    setSelectedNhom(null);
    setIsNhomFormOpen(true);
  };
  const handleEditNhom = (item: NhomDoiTac) => {
    setSelectedNhom(item);
    setIsNhomFormOpen(true);
  };
  const handleCancelNhomForm = () => {
    setIsNhomFormOpen(false);
    setSelectedNhom(null);
  };
  const handleSubmitNhom = async (formData: NhomDoiTacInput) => {
    setIsActionLoading(true);
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (selectedNhom) {
        await khachHangService.updateNhom(selectedNhom.id, payload);
        toast.success('Cập nhật nhóm khách hàng thành công!');
      } else {
        await khachHangService.createNhom(payload);
        toast.success('Thêm nhóm khách hàng mới thành công!');
      }
      handleCancelNhomForm();
      nhomQuery.refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + (error.message || 'Không thể lưu dữ liệu'));
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- KHÁCH HÀNG ---
  const handleAddKH = () => {
    setSelectedKH(null);
    setIsKHFormOpen(true);
  };
  const handleEditKH = (item: DoiTac) => {
    setSelectedKH(item);
    setDetailItem(null);
    setIsKHFormOpen(true);
  };
  const handleCancelKHForm = () => {
    setIsKHFormOpen(false);
    setSelectedKH(null);
  };
  const handleSubmitKH = async (formData: DoiTacInput) => {
    setIsActionLoading(true);
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (selectedKH) {
        await khachHangService.updateDoiTac(selectedKH.id, payload);
        toast.success('Cập nhật thông tin khách hàng thành công!');
      } else {
        await khachHangService.createDoiTac(payload);
        toast.success('Thêm khách hàng mới thành công!');
      }
      handleCancelKHForm();
      khQuery.refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + (error.message || 'Không thể lưu dữ liệu'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsActionLoading(true);
    try {
      if (activeTab === 'nhom') {
        await khachHangService.deleteNhom(deleteId);
        toast.success('Đã xóa nhóm khách hàng!');
        nhomQuery.refetch();
      } else {
        await khachHangService.deleteDoiTac(deleteId);
        toast.success('Đã xóa khách hàng!');
        khQuery.refetch();
      }
      setDeleteId(null);
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit mb-8 border border-slate-200/50 shadow-sm">
      <button
        onClick={() => setActiveTab('danh-sach')}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
          activeTab === 'danh-sach' ? "bg-white text-primary shadow-soft" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
        )}
      >
        <Users size={18} />
        Danh sách khách hàng
      </button>
      <button
        onClick={() => setActiveTab('nhom')}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
          activeTab === 'nhom' ? "bg-white text-primary shadow-soft" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
        )}
      >
        <LayoutGrid size={18} />
        Nhóm khách hàng
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      {renderTabs()}

      {activeTab === 'nhom' ? (
        <GenericListView<NhomDoiTac>
          title="Nhóm khách hàng"
          description="Quản lý phân loại khách hàng để tối ưu hóa chính sách giá."
          data={nhomQuery.data}
          isLoading={nhomQuery.isLoading}
          searchKey="ten_nhom"
          onAdd={handleAddNhom}
          renderTable={(filteredData) => (
            <NhomKHTable 
              data={filteredData} 
              onEdit={handleEditNhom} 
              onDelete={(item) => setDeleteId(item.id)}
            />
          )}
        />
      ) : (
        <GenericListView<DoiTac>
          title="Danh sách khách hàng"
          description="Quản lý toàn bộ thông tin đối tác khách hàng trong hệ thống."
          data={khQuery.data}
          isLoading={khQuery.isLoading}
          searchKey="ten_doi_tac"
          onAdd={handleAddKH}
          renderTable={(filteredData) => (
            <KHTable 
              data={filteredData} 
              onEdit={handleEditKH}
              onView={(item) => setDetailItem(item)}
              onDelete={(item) => setDeleteId(item.id)}
            />
          )}
        />
      )}

      {/* Sheet for KH Details */}
      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Thông tin khách hàng"
        description={`ID: #${detailItem?.id} | Nhóm: ${detailItem?.zz_capi_nhom_doi_tac?.ten_nhom || 'Vãng lai'}`}
        footer={
          detailItem && (
            <div className="flex w-full items-center justify-between">
              <Button variant="outline" onClick={() => setDetailItem(null)}>Đóng</Button>
              <div className="flex items-center gap-3">
                <Button onClick={() => handleEditKH(detailItem)} className="gap-2"> <Edit size={16} /> Sửa </Button>
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
        {detailItem && <KhachHangDetailView data={detailItem} />}
      </Sheet>

      {/* Sheet for KH Form */}
      <Sheet
        isOpen={isKHFormOpen}
        onClose={handleCancelKHForm}
        title={selectedKH ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
        description="Thông tin khách hàng sẽ được dùng cho việc tạo đơn hàng và báo cáo doanh số."
      >
        <KHFormView 
          key={selectedKH?.id}
          initialData={(selectedKH as unknown as Partial<DoiTacInput>) || undefined}
          onSubmit={handleSubmitKH}
          onCancel={handleCancelKHForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      {/* Sheet for NhomKH Form */}
      <Sheet
        isOpen={isNhomFormOpen}
        onClose={handleCancelNhomForm}
        title={selectedNhom ? "Cập nhật nhóm khách hàng" : "Tạo nhóm khách hàng mới"}
        description="Phân loại khách hàng giúp bạn quản lý chính sách giá và ưu đãi tốt hơn."
      >
        <NhomKHFormView 
          key={`nhom-${selectedNhom?.id}`}
          initialData={(selectedNhom as unknown as Partial<NhomDoiTacInput>) || undefined} 
          onSubmit={handleSubmitNhom}
          onCancel={handleCancelNhomForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      <ConfirmModal 
        isOpen={!!deleteId}
        title={activeTab === 'nhom' ? "Xác nhận xóa nhóm" : "Xác nhận xóa khách hàng"}
        message="Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default KhachHangModule;
