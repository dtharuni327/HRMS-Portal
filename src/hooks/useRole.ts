import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.includes(user?.role);
  };

  const isAdmin = hasRole('admin');
  const isHR = hasRole('hr');
  const isManager = hasRole('manager');
  const isEmployee = hasRole('employee');
  const isClient = hasRole('client');
  const isSuperAdmin = hasRole('superadmin');

  return {
    role: user?.role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isHR,
    isManager,
    isEmployee,
    isClient,
    isSuperAdmin,
  };
};