import { useNavigate } from 'react-router-dom';

import { logout } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

import { useState } from 'react';

export function useLogout() {
  const navigate = useNavigate();

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const [loading, setLoading] =
		useState(false);

  const handleLogout = async () => {
    if(loading) {
      return;
    }

    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error(
        'Logout request failed:',
        error,
      );
    } finally {
      clearAuth();
      setLoading(false);
      navigate('/login', {
        replace: true,
      });
    }
  };

  return {
		handleLogout,
		loading,
	};
}
