import { useNavigate } from 'react-router-dom';

import { logout } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { authStorage } from '../utils/auth-storage';

export function useLogout() {
  const navigate = useNavigate();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const handleLogout = async () => {
    const refreshToken = authStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch (error) {
      console.error(
        'Logout request failed:',
        error,
      );
    } finally {
      clearAuth();
      navigate('/login', {
        replace: true,
      });
    }
  };

  return handleLogout;
}