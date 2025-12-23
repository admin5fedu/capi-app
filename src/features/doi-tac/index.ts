// Module Đối tác
// Note: Không export * từ cả hai module vì chúng có tên trùng nhau (COT_HIEN_THI, LOAI_DOI_TAC, etc.)
// Import trực tiếp từ từng module khi cần:
// import { NhomDoiTacModule } from '@/features/doi-tac/nhom-doi-tac'
// import { DanhSachDoiTacModule } from '@/features/doi-tac/danh-sach-doi-tac'

// Export module components only
export { NhomDoiTacModule } from './nhom-doi-tac/index.tsx'
export { DanhSachDoiTacModule } from './danh-sach-doi-tac'

