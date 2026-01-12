
import React, { useState } from 'react';
import { GenericListView } from '../../shared/components/GenericListView';
import { useTyGiaList } from './hooks/use-ty-gia-queries';
import TyGiaTable from './components/ty-gia-table';
import TyGiaFormView from './components/ty-gia-form-view';
import TyGiaDetailView from './components/ty-gia-detail-view';
import ConfirmModal from '../../components/common/ConfirmModal';
import Sheet from '../../components/ui/Sheet';
import Button from '../../components/ui/Button';
import { TyGia, TyGiaInput } from './core/types';
import { tyGiaService } from './services/ty-gia-service';
import { toast } from 'sonner';
import { Edit, Trash2, TrendingUp } from 'lucide-react';
import { formatDate } from '../../shared/utils/format';

const formatRate = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const TyGiaModule: React.FC = () => {
  const { data, isLoading, refetch } = useTyGiaList();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TyGia | null>(null);
  const [detailItem, setDetailItem] = useState<TyGia | null>(null);
  const [deleteItem, setDeleteItem] = useState<TyGia | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: TyGia) => {
    setSelectedItem(item);
    setDetailItem(null);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData: TyGiaInput) => {
    setIsActionLoading(true);
    try {
      if (selectedItem) {
        await tyGiaService.update(selectedItem.id, formData);
        toast.success('Cập nhật tỷ giá thành công!');
      } else {
        await tyGiaService.create(formData);
        toast.success('Đã thêm tỷ giá mới!');
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
    if (!deleteItem) return;
    setIsActionLoading(true);
    try {
      await tyGiaService.delete(deleteItem.id);
      toast.success('Đã xóa bản ghi tỷ giá!');
      setDeleteItem(null);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };
  
  const latestRate = data?.[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {latestRate && (
         <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50 flex items-center gap-6 overflow-hidden relative">
          <div className="absolute top-[-20%] right-[-5%] w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tỷ giá gần nhất</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatRate(latestRate.ty_gia)} VND/USD</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Cập nhật lúc: {formatDate(latestRate.tg_tao || '')}</p>
          </div>
        </div>
      )}

      <GenericListView<TyGia>
        title="Lịch sử Tỷ giá"
        description="Theo dõi và cập nhật tỷ giá quy đổi USD/VND cho các giao dịch ngoại tệ."
        data={data}
        isLoading={isLoading}
        searchKey="ty_gia"
        onAdd={handleAdd}
        renderTable={(filteredData) => (
          <TyGiaTable 
            data={filteredData} 
            onEdit={handleEdit}
            onView={setDetailItem}
            onDelete={setDeleteItem}
          />
        )}
      />

      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Chi tiết tỷ giá"
        description="Thông tin chi tiết về bản ghi tỷ giá trong hệ thống."
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
        {detailItem && <TyGiaDetailView data={detailItem} />}
      </Sheet>

      <Sheet
        isOpen={isFormOpen}
        onClose={handleCancelForm}
        title={selectedItem ? "Cập nhật tỷ giá" : "Thêm tỷ giá mới"}
        description="Tỷ giá mới sẽ được áp dụng cho các giao dịch sau thời điểm này."
      >
        <TyGiaFormView 
          key={selectedItem?.id}
          initialData={selectedItem || undefined} 
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          isLoading={isActionLoading}
        />
      </Sheet>

      <ConfirmModal 
        isOpen={!!deleteItem}
        title="Xác nhận xóa"
        message="Hành động này sẽ xóa bản ghi tỷ giá khỏi lịch sử. Bạn có chắc chắn không?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default TyGiaModule;
