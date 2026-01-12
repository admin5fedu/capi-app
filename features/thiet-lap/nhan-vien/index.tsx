
import React, { useState } from 'react';
import { GenericListView } from '../../../shared/components/GenericListView';
import { useNhanVienList } from './hooks/use-nhan-vien-queries';
import NhanVienTable from './components/nhan-vien-table';
import NhanVienFormView from './components/nhan-vien-form-view';
import NhanVienDetailView from './components/nhan-vien-detail-view';
import ConfirmModal from '../../../components/common/ConfirmModal';
import Sheet from '../../../components/ui/Sheet';
import Button from '../../../components/ui/Button';
import { NhanVien, NhanVienInput } from './core/types';
import { nhanVienService } from './services/nhan-vien-service';
import { profileService } from '../ho-so/services/profile-service';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../store/auth-store';

const NhanVienModule: React.FC = () => {
  const { data, isLoading, refetch } = useNhanVienList();
  const { profile } = useAuthStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NhanVien | null>(null);
  const [detailItem, setDetailItem] = useState<NhanVien | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (nv: NhanVien) => {
    setSelectedItem(nv);
    setDetailItem(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData: NhanVienInput) => {
    setIsActionLoading(true);
    try {
        const avatarFile = formData.avatarFile?.[0];
        const payload: Partial<NhanVienInput> = { ...formData };
        delete payload.avatarFile;
        
        // Loại bỏ trường dữ liệu join không tồn tại trong bảng gốc
        delete (payload as any).zz_capi_vai_tro;

        if (selectedItem) { // UPDATE logic
            if (avatarFile) {
                const toastId = toast.loading('Đang tải ảnh đại diện...');
                try {
                    const avatarUrl = await profileService.uploadAvatar(selectedItem.id, avatarFile);
                    payload.avatar = avatarUrl;
                    toast.dismiss(toastId);
                } catch (uploadError) {
                    toast.error('Tải ảnh thất bại.', { id: toastId });
                    throw uploadError;
                }
            }
            await nhanVienService.update(selectedItem.id, payload);
            toast.success('Cập nhật người dùng thành công!');
        } else { // CREATE logic
            const payloadWithCreator = { ...payload, nguoi_tao_id: profile?.id || null };
            const newUser = await nhanVienService.create(payloadWithCreator as NhanVienInput);
            if (avatarFile && newUser.id) {
                const toastId = toast.loading('Đang tải ảnh đại diện...');
                try {
                    const avatarUrl = await profileService.uploadAvatar(newUser.id, avatarFile);
                    await nhanVienService.update(newUser.id, { avatar: avatarUrl });
                    toast.dismiss(toastId);
                } catch (uploadError) {
                    toast.error('Tải ảnh thất bại, nhưng người dùng đã được tạo.', { id: toastId });
                }
            }
            toast.success('Thêm người dùng mới thành công!');
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
      await nhanVienService.delete(deleteId);
      toast.success('Đã xóa người dùng khỏi hệ thống!');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <GenericListView<NhanVien>
        title="Quản lý Người dùng"
        description="Kết nối trực tiếp tới bảng zz_capi_nguoi_dung."
        data={data}
        isLoading={isLoading}
        searchKey="ho_va_ten"
        onAdd={handleAdd}
        renderTable={(filteredData) => (
          <NhanVienTable 
            data={filteredData} 
            onEdit={handleEdit} 
            onView={(nv) => setDetailItem(nv)}
            onDelete={(nv) => setDeleteId(nv.id)}
          />
        )}
      />

      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Thông tin chi tiết"
        description="Toàn bộ thông tin được lưu trữ trong hệ thống."
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
        {detailItem && <NhanVienDetailView data={detailItem} />}
      </Sheet>
      
      <Sheet
        isOpen={isFormOpen}
        onClose={handleCancelForm}
        title={selectedItem ? "Chỉnh sửa thông tin" : "Thêm người dùng mới"}
        description="Dữ liệu được quản lý tập trung và liên kết với bảng Vai trò."
      >
        <NhanVienFormView 
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
        message="Dữ liệu sẽ bị xóa vĩnh viễn khỏi bảng zz_capi_nguoi_dung. Bạn có chắc chắn không?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default NhanVienModule;
