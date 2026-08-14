import { useEffect } from 'react';

import { refresh } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { authStorage } from '../utils/auth-storage';

export function useAuthInitialization() {
	const setAuth = useAuthStore(
		(state) => state.setAuth,
	);

	const clearAuth = useAuthStore(
		(state) => state.clearAuth,
	);

	const setInitialized = useAuthStore(
		(state) => state.setInitialized,
	);

	useEffect(() => {
		const initializeAuth = async () => {
			const refreshToken =
				authStorage.getRefreshToken();

			if (!refreshToken) {
				setInitialized();
				return;
			}

			try {

				const response = await refresh({
					refreshToken,
				});

				console.log('🟢 Refresh API completed', response);

				/**
				 * Backend refresh returns new tokens
				 * but does not return the user.
				 *
				 * Existing user remains in memory only
				 * during the current SPA session.
				 */
				const currentUser =
					useAuthStore.getState().user;

				if (!currentUser) {
					throw new Error(
						'Authenticated user is unavailable.',
					);
				}

				setAuth(
					currentUser,
					response.accessToken,
					response.refreshToken,
				);

			} catch (error) {
				// No valid session.
				console.error(
					'Auth initialization failed:',
					error,
				);
				clearAuth();
			} finally {
				setInitialized();
			}
		};

		void initializeAuth();
	}, [setAuth, clearAuth(), setInitialized]);
}