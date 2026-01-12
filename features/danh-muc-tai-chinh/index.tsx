
import React, { useState, useMemo } from 'react';
import { GenericListView } from '../../shared/components/GenericListView';
import { useDanhMucTaiChinhList } from './hooks/use-danh-muc-tai-chinh-queries';
import DMTCTable from './components/dmtc-table';
import DMTCFormView from './components/dmtc-form-view';
import DMTCDetailView from './components/dmtc-detail-view';
import ConfirmModal from '../../components/common/ConfirmModal';
import Sheet from '../../components/ui/Sheet';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { DanhMucTaiChinh, DanhMucTaiChinhInput, HangMucTaiChinh } from './core/types';
import { danhMucTaiChinhService } from './services/danh-muc-tai-chinh-service';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth-store';

type ActiveTab = 'chi' | 'thu';

const buildTree = (items: DanhMucTaiChinh[]): DanhMucTaiChinh[] => {
  const map = new Map(items.map(item => [item.id, { ...item, children: [] }]));
  const tree: DanhMucTaiChinh[] = [];

  for (const item of Array.from(map.values())) {
    if (item.danh_muc_cha_id && map.has(item.danh_muc_cha_id)) {
      const parent = map.get(item.danh_muc_cha_id)!;
      if (!parent.children) parent.children = [];
      parent.children.push(item);
    } else {
      tree.push(item);
    }
  }
  return tree;
};


const DanhMucTaiChinhModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chi');
  const { profile } = useAuthStore();
  const { data: flatData, isLoading, refetch } = useDanhMucTaiChinhList();
  
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DanhMucTaiChinh | null>(null);
  const [detailItem, setDetailItem] = useState<DanhMucTaiChinh | null>(null);
  const [deleteItem, setDeleteItem] = useState<DanhMucTaiChinh | null>(null);
  const [addChildParent, setAddChildParent] = useState<DanhMucTaiChinh | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const treeData = useMemo(() => {
    if (!flatData) return [];
    const filtered = flatData.filter(item => item.hang_muc === activeTab);
    const tree = buildTree(filtered);
    
    if (detailItem) {
      const findItemInTree = (nodes: DanhMucTaiChinh[], id: number): DanhMucTaiChinh | undefined => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findItemInTree(node.children, id);
            if (found) return found;
          }
        }
      };
      const currentDetailInTree = findItemInTree(tree, detailItem.id);
      if (currentDetailInTree) setDetailItem(currentDetailInTree);
    }
    return tree;
  }, [flatData, activeTab, detailItem?.id]);
  
  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormSheetOpen(true);
  };
  const handleEdit = (item: DanhMucTaiChinh) => {
    setSelectedItem(item);
    setDetailItem(null);
    setIsFormSheetOpen(true);
  };
  const handleAddChild = (parent: DanhMucTaiChinh) => {
    setDetailItem(null);
    setAddChildParent(parent);
  };
  const handleCloseForms = () => {
    setIsFormSheetOpen(false);
    setAddChildParent(null);
    setSelectedItem(null);
  };

  const handleSubmit = async (formData: DanhMucTaiChinhInput) => {
    setIsActionLoading(true);
    const isEditing = !!selectedItem;
    try {
      const payload = { ...formData, nguoi_tao_id: profile?.id || null };
      if (isEditing) {
        await danhMucTaiChinhService.update(selectedItem!.id, payload);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await danhMucTaiChinhService.create(payload);
        toast.success('Thêm danh mục mới thành công!');
      }
      handleCloseForms();
      refetch();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsActionLoading(true);
    try {
      await danhMucTaiChinhService.delete(deleteItem.id);
      toast.success(`Đã xóa danh mục "${deleteItem.ten_danh_muc}"!`);
      setDeleteItem(null);
      refetch();
    } catch (error: any) {
      toast.error('Lỗi khi xóa: ' + error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit mb-8 border border-slate-200/50 shadow-sm">
      <button
        onClick={() => setActiveTab('chi')}
        className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === 'chi' ? "bg-white text-rose-600 shadow-soft" : "text-slate-500 hover:text-slate-700")}
      > <ArrowUp size={16} /> Hạng mục Chi </button>
      <button
        onClick={() => setActiveTab('thu')}
        className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === 'thu' ? "bg-white text-emerald-600 shadow-soft" : "text-slate-500 hover:text-slate-700")}
      > <ArrowDown size={16} /> Hạng mục Thu </button>
    </div>
  );
  
  return (
    <div className="animate-in fade-in duration-500">
      {renderTabs()}

      <GenericListView<DanhMucTaiChinh>
        title={`Danh mục Tài chính - ${activeTab === 'chi' ? 'Chi phí' : 'Thu nhập'}`}
        description="Quản lý cây danh mục để phân loại các giao dịch tài chính."
        data={treeData}
        isLoading={isLoading}
        searchKey="ten_danh_muc"
        onAdd={handleAdd}
        renderTable={(filteredData) => (
          <DMTCTable 
            data={filteredData} 
            onEdit={handleEdit} 
            onView={setDetailItem}
            onDelete={setDeleteItem}
            onAddChild={handleAddChild}
          />
        )}
      />

      <Sheet
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Chi tiết danh mục"
        description="Thông tin phân loại và hệ thống."
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
        {detailItem && <DMTCDetailView 
          data={detailItem} 
          onAddChild={handleAddChild}
          onEdit={handleEdit}
          onDelete={item => {
            setDeleteItem(item);
            setDetailItem(null);
          }}
        />}
      </Sheet>

      <Sheet
        isOpen={isFormSheetOpen}
        onClose={handleCloseForms}
        title={selectedItem ? "Cập nhật danh mục" : "Tạo danh mục gốc"}
        description="Điền thông tin và lưu lại để hoàn tất."
      >
        <DMTCFormView 
          key={selectedItem?.id || 'new-root'}
          initialData={selectedItem ? { ...selectedItem, hang_muc: selectedItem.hang_muc as HangMucTaiChinh } : { hang_muc: activeTab }}
          danhMucList={flatData}
          onSubmit={handleSubmit}
          onCancel={handleCloseForms}
          isLoading={isActionLoading}
        />
      </Sheet>

      <Modal
        isOpen={!!addChildParent}
        onClose={handleCloseForms}
        title={`Thêm mục con cho "${addChildParent?.ten_danh_muc}"`}
      >
        <DMTCFormView 
          key={`new-${addChildParent?.id}`}
          initialData={{ 
            hang_muc: addChildParent?.hang_muc as HangMucTaiChinh,
            danh_muc_cha_id: addChildParent?.id
          }}
          danhMucList={flatData}
          onSubmit={handleSubmit}
          onCancel={handleCloseForms}
          isLoading={isActionLoading}
        />
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteItem}
        title="Xác nhận xóa danh mục"
        message={`Hành động này không thể hoàn tác. Việc xóa danh mục cha có thể ảnh hưởng đến các danh mục con. Bạn có chắc muốn xóa "${deleteItem?.ten_danh_muc}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default DanhMucTaiChinhModule;
