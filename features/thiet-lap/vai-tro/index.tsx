
import React, { useState } from 'react';
import { GenericListView } from '../../../shared/components/GenericListView';
import { useVaiTroList } from './hooks/use-vai-tro-queries';
import VaiTroTable from './components/vai-tro-table';
import VaiTroFormView from './components/vai-tro-form-view';
import VaiTroDetailView from './components/vai-tro-detail-view';
import ConfirmModal from '../../../components/common/ConfirmModal';
import Sheet from '../../../components/ui/Sheet';
import Button from '../../../components/ui/Button';
import { VaiTro, VaiTroInput } from './core/types';
import { vaiTroService } from './services/vai-tro-service';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';

const VaiTroModule: React.FC = () => {
  const { data, isLoading, refetch } = useVaiTroList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VaiTro | null>(null);
  const [detailItem, setDetailItem] = useState<VaiTro | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vt: VaiTro) => {
    setSelectedItem(vt);
    setDetailItem(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData: VaiTroInput) => {
    setIsActionLoading(true);
    try {
      if (selectedItem) {
        await vaiTroService.update(selectedItem.id, formData);
        toast.success('Cập nhật vai trò thành công!');
      } else {
        await vaiTroService.create(formData);
        toast.success('Thêm vai trò mới thành công!');
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
      await vaiTroService.delete(deleteId);
      toast.success('Đã xóa vai trò!');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <GenericListView<VaiTro>
        title="Quản lý Vai trò"
        description="Định nghĩa các vị trí và vai trò chức năng trong doanh nghiệp."
        data={data}
        isLoading={isLoading}
        searchKey="ten_vai_tro"
        onAdd={handleAdd}
        renderTable={(filteredData) => (
          <VaiTroTable 
            data={filteredData} 
            onEdit={handleEdit} 
            onView={(vt) => setDetailItem(vt)}
            onDelete={(vt) => setDeleteId(vt.id)}
          />
        )}
      />

      {/* Sheet for Details */}
      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Chi tiết vai trò"
        description="Thông tin định danh và thời gian tạo của vai trò."
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
        {detailItem && <VaiTroDetailView data={detailItem} />}
      </Sheet>

      {/* Sheet for Form */}
      <Sheet
        isOpen={isFormOpen}
        onClose={handleCancelForm}
        title={selectedItem ? "Cập nhật vai trò" : "Tạo vai trò mới"}
        description="Điền thông tin và lưu lại để hoàn tất."
      >
        <VaiTroFormView 
          key={selectedItem?.id}
          initialData={selectedItem || undefined} 
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Xác nhận xóa"
        message="Hành động này không thể hoàn tác. Các nhân viên thuộc vai trò này có thể bị ảnh hưởng."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isActionLoading}
      />
    </>
  );
};

export default VaiTroModule;
