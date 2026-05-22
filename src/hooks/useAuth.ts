import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust path as needed

export const useAuth = () => {
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
  };
};