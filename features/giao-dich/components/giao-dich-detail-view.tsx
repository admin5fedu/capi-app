
import React from 'react';
import { GiaoDich } from '../core/types';
import {
  ArrowDown, ArrowUp, ArrowRightLeft, Calendar, Tag, LogIn, LogOut, Repeat, FileText, MessageSquare, Clock, User
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../../shared/utils/format';

interface GiaoDichDetailViewProps {
  data: GiaoDich;
}

const GiaoDichDetailView: React.FC<GiaoDichDetailViewProps> = ({ data }) => {
  const hangMuc = data.hang_muc;
  let Icon, colorClass, shadowClass, title;

  switch (hangMuc) {
    case 'thu':
      Icon = ArrowDown;
      colorClass = 'text-emerald-600 bg-emerald-50';
      shadowClass = 'shadow-emerald-500/10';
      title = 'Giao dịch Thu';
      break;
    case 'chi':
      Icon = ArrowUp;
      colorClass = 'text-rose-600 bg-rose-50';
      shadowClass = 'shadow-rose-500/10';
      title = 'Giao dịch Chi';
      break;
    case 'chuyen_tien':
      Icon = ArrowRightLeft;
      colorClass = 'text-blue-600 bg-blue-50';
      shadowClass = 'shadow-blue-500/10';
      title = 'Chuyển tiền nội bộ';
      break;
    default:
      Icon = ArrowRightLeft;
      colorClass = 'text-slate-600 bg-slate-100';
      shadowClass = 'shadow-slate-500/10';
      title = 'Giao dịch';
  }

  const mainInfo = [
    { label: 'Ngày giao dịch', value: formatDate(data.ngay || ''), icon: Calendar },
    { label: 'Đối tác', value: data.ten_doi_tac, icon: User, hide: !data.ten_doi_tac },
    { label: 'Danh mục', value: data.ten_danh_muc, icon: Tag, hide: hangMuc === 'chuyen_tien' },
    { label: 'Từ tài khoản', value: data.ten_tai_khoan_di, icon: LogOut, hide: hangMuc === 'thu' },
    { label: 'Vào tài khoản', value: data.ten_tai_khoan_den, icon: LogIn, hide: hangMuc === 'chi' },
  ];

  const exchangeInfo = [
    { label: 'Tỷ giá áp dụng', value: new Intl.NumberFormat('vi-VN').format(data.so_ty_gia || 0), icon: Repeat },
    { label: 'Số tiền quy đổi', value: formatCurrency(data.so_tien_quy_doi_den || data.so_tien_quy_doi_di || 0, 'VND'), icon: Repeat },
  ];

  const additionalInfo = [
    { label: 'Chứng từ', value: data.chung_tu, icon: FileText },
    { label: 'Ghi chú', value: data.ghi_chu, icon: MessageSquare },
  ];

  const systemInfo = [
    { label: 'Ngày tạo', value: data.tg_tao ? formatDate(data.tg_tao) : '-', icon: Calendar },
    { label: 'Cập nhật cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : '-', icon: Clock },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className={`flex flex-col items-center text-center pb-6 border-b border-slate-100`}>
        <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-lg mb-4 ${colorClass} ${shadowClass}`}>
          <Icon size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{data.mo_ta}</h3>
        <p className="text-3xl font-extrabold text-slate-800 mt-2">{formatCurrency(data.so_tien || 0, data.don_vi)}</p>
        {data.don_vi === 'USD' && (data.so_tien_quy_doi_den || data.so_tien_quy_doi_di) && (
          <p className="text-base text-slate-400 font-medium mt-1">
            ≈ {formatCurrency(data.so_tien_quy_doi_den || data.so_tien_quy_doi_di || 0, 'VND')}
          </p>
        )}
        <p className="text-sm text-slate-500 mt-1">{title}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin chính</h4>
          <div className="space-y-4">
            {mainInfo.filter(item => !item.hide && item.value).map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.ty_gia_id && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quy đổi ngoại tệ</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exchangeInfo.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <item.icon size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.chung_tu || data.ghi_chu) && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin bổ sung</h4>
            <div className="space-y-4">
              {additionalInfo.filter(item => item.value).map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                    <p className="text-sm font-medium text-slate-600 whitespace-pre-wrap">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin hệ thống</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {systemInfo.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <item.icon size={16} className="text-slate-400" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiaoDichDetailView;