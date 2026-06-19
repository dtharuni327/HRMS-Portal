import { useAuthContext } from "../context/AuthContext";

export const useRole = () => {
  const { user } = useAuthContext();

  const normalizeRole = (role?: string) =>
    role?.trim().toUpperCase().replace(/\s+/g, "_");

  const hasRole = (role: string) => {
    return normalizeRole(user?.role) === normalizeRole(role);
  };

  const hasAnyRole = (roles: string[]) => {
    const currentRole = normalizeRole(user?.role);
    return roles.map(normalizeRole).includes(currentRole);
  };

  const isHR = hasRole('HR_ADMIN');
  const isManager = hasRole('MANAGER');
  const isEmployee = hasRole('EMPLOYEE');
  const isClient = hasRole('CLIENT');
  const isSuperAdmin = hasRole('SUPER_ADMIN');
  const isFinance = hasRole('FINANCE');

  return {
    role: user?.role,
    hasRole,
    hasAnyRole,
    isHR,
    isManager,
    isEmployee,
    isClient,
    isSuperAdmin,
    isFinance,
  };
};
