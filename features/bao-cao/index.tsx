
import React, { useState } from 'react';
import ReportFilterBar from './components/ReportFilterBar';
import BaoCaoDongTien from './components/BaoCaoDongTien';
import BaoCaoSoQuy from './components/BaoCaoSoQuy';
import BaoCaoLaiLo from './components/BaoCaoLaiLo';
import BaoCaoDoanhThuTheoKH from './components/BaoCaoDoanhThuTheoKH';
import BaoCaoChiPhiTheoNCC from './components/BaoCaoChiPhiTheoNCC';
import BaoCaoChiPhiTheoHangMuc from './components/BaoCaoChiPhiTheoHangMuc';
import { cn } from '../../lib/utils';
import { BarChart2, BookOpen, DollarSign, Users, Truck, ListTree } from 'lucide-react';
import { useTaiKhoanList } from '../tai-khoan/hooks/use-tai-khoan-queries';
import { useNhomKhachHangList } from '../khach-hang/hooks/use-khach-hang-queries';
import { useNhomNCCList } from '../nha-cung-cap/hooks/use-nha-cung-cap-queries';

type ReportGroup = 'tai-chinh' | 'kinh-doanh';
type ActiveTab = 'dong-tien' | 'so-quy' | 'lai-lo' | 'dt-kh' | 'cp-ncc' | 'cp-hang-muc';

type ReportTab = {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    comingSoon?: boolean;
};

const getMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date();
    return {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
    };
};

const financialTabs: ReportTab[] = [
    { id: 'dong-tien', label: 'Dòng tiền', icon: BarChart2 },
    { id: 'so-quy', label: 'Sổ quỹ', icon: BookOpen },
    { id: 'lai-lo', label: 'Lãi/Lỗ', icon: DollarSign },
];
const businessTabs: ReportTab[] = [
    { id: 'dt-kh', label: 'DT theo KH', icon: Users },
    { id: 'cp-ncc', label: 'CP theo NCC', icon: Truck },
    { id: 'cp-hang-muc', label: 'CP theo Hạng mục', icon: ListTree },
];

const BaoCaoModule: React.FC = () => {
    const [reportGroup, setReportGroup] = useState<ReportGroup>('tai-chinh');
    const [activeTab, setActiveTab] = useState<ActiveTab>('dong-tien');
    const { start, end } = getMonthRange();
    
    const [startDate, setStartDate] = useState(start);
    const [endDate, setEndDate] = useState(end);

    const { data: taiKhoanList, isLoading: isTaiKhoanLoading } = useTaiKhoanList();
    const { data: nhomKHList, isLoading: isNhomKHLoading } = useNhomKhachHangList();
    const { data: nhomNCCList, isLoading: isNhomNCCLoading } = useNhomNCCList();
    
    const [selectedTaiKhoanId, setSelectedTaiKhoanId] = useState<number | null>(null);
    const [selectedNhomKHId, setSelectedNhomKHId] = useState<number | null>(null);
    const [selectedNhomNCCId, setSelectedNhomNCCId] = useState<number | null>(null);

    const [filter, setFilter] = useState({ 
        startDate: new Date(start), 
        endDate: new Date(end),
        accountId: null as number | null,
        nhomKHId: null as number | null,
        nhomNCCId: null as number | null,
    });

    const handleApplyFilter = () => {
        setFilter({ 
            startDate: new Date(startDate), 
            endDate: new Date(endDate),
            accountId: selectedTaiKhoanId,
            nhomKHId: selectedNhomKHId,
            nhomNCCId: selectedNhomNCCId,
        });
    };
    
    const handleReportGroupChange = (group: ReportGroup) => {
        setReportGroup(group);
        const firstTabId = group === 'tai-chinh' ? financialTabs[0].id : businessTabs[0].id;
        setActiveTab(firstTabId as ActiveTab);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dong-tien': return <BaoCaoDongTien startDate={filter.startDate} endDate={filter.endDate} />;
            case 'so-quy': return <BaoCaoSoQuy accountId={filter.accountId} startDate={filter.startDate} endDate={filter.endDate} />;
            case 'dt-kh': return <BaoCaoDoanhThuTheoKH startDate={filter.startDate} endDate={filter.endDate} nhomKHId={filter.nhomKHId} />;
            case 'cp-ncc': return <BaoCaoChiPhiTheoNCC startDate={filter.startDate} endDate={filter.endDate} nhomNCCId={filter.nhomNCCId} />;
            case 'cp-hang-muc': return <BaoCaoChiPhiTheoHangMuc startDate={filter.startDate} endDate={filter.endDate} taiKhoanId={filter.accountId} />;
            case 'lai-lo': return <BaoCaoLaiLo startDate={filter.startDate} endDate={filter.endDate} />;
            default: return null;
        }
    };
    
    const currentTabs = reportGroup === 'tai-chinh' ? financialTabs : businessTabs;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Báo cáo Quản trị</h1>
                <p className="text-slate-500 font-medium mt-1">Phân tích và trực quan hóa dữ liệu của doanh nghiệp.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-b border-slate-200">
                <button onClick={() => handleReportGroupChange('tai-chinh')} className={cn("pb-3 border-b-2 font-bold text-sm flex items-center gap-2", reportGroup === 'tai-chinh' ? "text-primary border-primary" : "text-slate-500 border-transparent hover:text-slate-800")}>Báo cáo Tài chính</button>
                <button onClick={() => handleReportGroupChange('kinh-doanh')} className={cn("pb-3 border-b-2 font-bold text-sm flex items-center gap-2", reportGroup === 'kinh-doanh' ? "text-primary border-primary" : "text-slate-500 border-transparent hover:text-slate-800")}>Báo cáo Kinh doanh</button>
            </div>
            
            <div className="flex p-1 bg-slate-200/50 rounded-2xl w-fit border border-slate-200/50 shadow-sm">
                {currentTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as ActiveTab)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === tab.id ? "bg-white text-primary shadow-soft" : "text-slate-500 hover:text-slate-700 hover:bg-white/50")}>
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.comingSoon && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">Sắp có</span>}
                    </button>
                ))}
            </div>

            <ReportFilterBar
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApplyFilter}
                {...( (activeTab === 'so-quy' || activeTab === 'cp-hang-muc') && {
                    taiKhoanList: taiKhoanList,
                    selectedTaiKhoanId: selectedTaiKhoanId,
                    onTaiKhoanChange: (id) => setSelectedTaiKhoanId(id ? Number(id) : null),
                    isTaiKhoanLoading: isTaiKhoanLoading,
                })}
                {...(activeTab === 'dt-kh' && {
                    nhomKHList, selectedNhomKHId,
                    onNhomKHChange: (id: string) => setSelectedNhomKHId(id ? Number(id) : null),
                    isNhomKHLoading,
                })}
                 {...(activeTab === 'cp-ncc' && {
                    nhomNCCList, selectedNhomNCCId,
                    onNhomNCCChange: (id: string) => setSelectedNhomNCCId(id ? Number(id) : null),
                    isNhomNCCLoading,
                })}
            />
            
            {renderContent()}
        </div>
    );
};

export default BaoCaoModule;
