
import React, { useState } from 'react';
import { GenericListView } from '../../shared/components/GenericListView';
import { useNhomNCCList, useNCCList } from './hooks/use-nha-cung-cap-queries';
import NhomNCCTable from './components/nhom-ncc-table';
import NhomNCCFormView from './components/nhom-ncc-form-view';
import NCCTable from './components/ncc-table';
import NCCFormView from './components/ncc-form-view';
import NhaCungCapDetailView from './components/ncc-detail-view';
import ConfirmModal from '../../components/common/ConfirmModal';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import { NhomDoiTac, NhomNCCInput, DoiTac, NCCInput } from './core/types';
import { nhaCungCapService } from './services/nha-cung-cap-service';
import { toast } from 'sonner';
import { Truck, Tags, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth-store';

type ActiveTab = 'danh-sach' | 'nhom';

const NhaCungCapModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('danh-sach');
  const { profile } = useAuthStore();
  
  const nhomQuery = useNhomNCCList();
  const nccQuery = useNCCList();
  
  const [isNhomFormOpen, setIsNhomFormOpen] = useState(false);
  const [isNCCFormOpen, setIsNCCFormOpen] = useState(false);
  const [selectedNhom, setSelectedNhom] = useState<NhomDoiTac | null>(null);
  const [selectedNCC, setSelectedNCC] = useState<DoiTac | null>(null);
  const [detailItem, setDetailItem] = useState<DoiTac | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- NHÓM NCC ---
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
  const handleSubmitNhom = async (formData: NhomNCCInput) => {
    setIsActionLoading(true);
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (selectedNhom) {
        await nhaCungCapService.updateNhom(selectedNhom.id, payload);
        toast.success('Cập nhật nhóm NCC thành công!');
      } else {
        await nhaCungCapService.createNhom(payload);
        toast.success('Thêm nhóm NCC mới thành công!');
      }
      handleCancelNhomForm();
      nhomQuery.refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- NCC ---
  const handleAddNCC = () => {
    setSelectedNCC(null);
    setIsNCCFormOpen(true);
  };
  const handleEditNCC = (item: DoiTac) => {
    setSelectedNCC(item);
    setDetailItem(null);
    setIsNCCFormOpen(true);
  };
  const handleCancelNCCForm = () => {
    setIsNCCFormOpen(false);
    setSelectedNCC(null);
  };
  const handleSubmitNCC = async (formData: NCCInput) => {
    setIsActionLoading(true);
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (selectedNCC) {
        await nhaCungCapService.updateNCC(selectedNCC.id, payload);
        toast.success('Cập nhật Nhà cung cấp thành công!');
      } else {
        await nhaCungCapService.createNCC(payload);
        toast.success('Thêm Nhà cung cấp mới thành công!');
      }
      handleCancelNCCForm();
      nccQuery.refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsActionLoading(true);
    try {
      if (activeTab === 'nhom') {
        await nhaCungCapService.deleteNhom(deleteId);
        toast.success('Đã xóa nhóm nhà cung cấp!');
        nhomQuery.refetch();
      } else {
        await nhaCungCapService.deleteNCC(deleteId);
        toast.success('Đã xóa nhà cung cấp!');
        nccQuery.refetch();
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
        <Truck size={18} />
        Danh sách NCC
      </button>
      <button
        onClick={() => setActiveTab('nhom')}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
          activeTab === 'nhom' ? "bg-white text-primary shadow-soft" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
        )}
      >
        <Tags size={18} />
        Nhóm NCC
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      {renderTabs()}

      {activeTab === 'nhom' ? (
        <GenericListView<NhomDoiTac>
          title="Nhóm Nhà cung cấp"
          description="Phân loại NCC giúp bạn quản lý danh mục hàng hóa và công nợ tốt hơn."
          data={nhomQuery.data}
          isLoading={nhomQuery.isLoading}
          searchKey="ten_nhom"
          onAdd={handleAddNhom}
          renderTable={(filteredData) => (
            <NhomNCCTable 
              data={filteredData} 
              onEdit={handleEditNhom} 
              onDelete={(item) => setDeleteId(item.id)}
            />
          )}
        />
      ) : (
        <GenericListView<DoiTac>
          title="Danh sách Nhà cung cấp"
          description="Quản lý toàn bộ thông tin đối tác cung cấp hàng hóa/dịch vụ."
          data={nccQuery.data}
          isLoading={nccQuery.isLoading}
          searchKey="ten_doi_tac"
          onAdd={handleAddNCC}
          renderTable={(filteredData) => (
            <NCCTable 
              data={filteredData} 
              onEdit={handleEditNCC}
              onView={(item) => setDetailItem(item)}
              onDelete={(item) => setDeleteId(item.id)}
            />
          )}
        />
      )}
      
      {/* Sheet for NCC Details */}
      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Thông tin nhà cung cấp"
        description={`ID: #${detailItem?.id} | Nhóm: ${detailItem?.zz_capi_nhom_doi_tac?.ten_nhom || 'Mặc định'}`}
        footer={
          detailItem && (
            <div className="flex w-full items-center justify-between">
              <Button variant="outline" onClick={() => setDetailItem(null)}>Đóng</Button>
              <div className="flex items-center gap-3">
                <Button onClick={() => handleEditNCC(detailItem)} className="gap-2"> <Edit size={16} /> Sửa </Button>
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
        {detailItem && <NhaCungCapDetailView data={detailItem} />}
      </Sheet>

      {/* Sheet for NCC Form */}
      <Sheet
        isOpen={isNCCFormOpen}
        onClose={handleCancelNCCForm}
        title={selectedNCC ? "Cập nhật Nhà cung cấp" : "Thêm Nhà cung cấp mới"}
        description="Quản lý thông tin nhà cung cấp để phục vụ mua hàng và nhập kho."
      >
        <NCCFormView 
          key={selectedNCC?.id}
          initialData={(selectedNCC as unknown as Partial<NCCInput>) || undefined}
          onSubmit={handleSubmitNCC}
          onCancel={handleCancelNCCForm}
          isLoading={isActionLoading}
        />
      </Sheet>
      
      {/* Sheet for NhomNCC Form */}
      <Sheet
        isOpen={isNhomFormOpen}
        onClose={handleCancelNhomForm}
        title={selectedNhom ? "Cập nhật nhóm NCC" : "Tạo nhóm NCC mới"}
        description="Quản lý các nhóm nhà cung cấp giúp hệ thống báo cáo chính xác hơn."
      >
        <NhomNCCFormView 
          key={`nhom-${selectedNhom?.id}`}
          initialData={(selectedNhom as unknown as Partial<NhomNCCInput>) || undefined} 
          onSubmit={handleSubmitNhom}
          onCancel={handleCancelNhomForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      <ConfirmModal 
        isOpen={!!deleteId}
        title={activeTab === 'nhom' ? "Xác nhận xóa nhóm" : "Xác nhận xóa NCC"}
        message="Dữ liệu sẽ bị xóa khỏi hệ thống. Hãy đảm bảo NCC này không còn liên kết với các đơn hàng."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default NhaCungCapModule;
