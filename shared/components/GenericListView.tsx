
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, Plus, ListFilter, SlidersHorizontal, ArrowDownToLine } from 'lucide-react';

interface GenericListViewProps<T> {
  title: string;
  description?: string;
  data: T[] | undefined;
  isLoading: boolean;
  searchKey?: keyof T;
  onAdd?: () => void;
  renderTable: (data: T[]) => React.ReactNode;
}

export function GenericListView<T>({ 
  title, 
  description,
  data, 
  isLoading, 
  searchKey,
  onAdd,
  renderTable 
}: GenericListViewProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = React.useMemo(() => {
    if (!data || !searchTerm || !searchKey) return data || [];
    return data.filter((item) => 
      String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm, searchKey]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {description && <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <Button variant="outline" size="sm" className="gap-2 font-bold rounded-xl border-slate-200 hidden sm:inline-flex">
            <ArrowDownToLine size={16} />
            Xuất dữ liệu
          </Button>
          {onAdd && (
            <Button size="sm" className="gap-2 font-bold rounded-xl shadow-primary-glow w-full sm:w-auto" onClick={onAdd}>
              <Plus size={18} />
              Thêm mới
            </Button>
          )}
        </div>
      </div>

      <Card noPadding className="border-none shadow-soft-lg">
        <div className="p-4 md:p-6 border-b border-slate-50 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Tìm kiếm nhanh..." 
              className="w-full h-11 pl-11 pr-4 bg-slate-50 rounded-xl border border-transparent focus:border-primary/20 focus:bg-white transition-all font-medium text-sm outline-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
             <Button variant="ghost" size="sm" className="h-11 px-4 gap-2 text-slate-500 font-bold hover:bg-slate-50 rounded-xl flex-1 lg:flex-none">
              <ListFilter size={16} />
              Trạng thái
            </Button>
            <Button variant="outline" size="sm" className="h-11 px-4 gap-2 border-slate-100 text-slate-600 font-bold rounded-xl flex-1 lg:flex-none">
              <SlidersHorizontal size={16} />
              Bộ lọc
            </Button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
          ) : filteredData.length > 0 ? (
            renderTable(filteredData)
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <Search size={32} className="text-slate-200" />
              </div>
              <p className="text-base font-bold text-slate-900">Không tìm thấy kết quả</p>
              <p className="text-sm text-slate-400 mt-1">Vui lòng thử từ khóa khác hoặc xóa bộ lọc.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
