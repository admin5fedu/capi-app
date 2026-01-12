
import { useAuthStore } from '../../store/auth-store';
import { VaiTro } from '../../types';

export function usePermission() {
  const { user } = useAuthStore();

  const hasRole = (roles: VaiTro[]) => {
    if (!user) return false;
    return roles.includes(user.vai_tro);
  };

  const isAdmin = user?.vai_tro === 'admin';
  const isManager = user?.vai_tro === 'quan_ly' || isAdmin;

  return {
    user,
    hasRole,
    isAdmin,
    isManager,
  };
}
