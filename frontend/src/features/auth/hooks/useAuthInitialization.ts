import { useEffect } from 'react';

import { refresh } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAuthInitialization() {
	const updateTokens = useAuthStore(
		(state) => state.updateTokens,
	);

	const setInitialized = useAuthStore(
		(state) => state.setInitialized,
	);

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const response = await refresh();
				updateTokens(
					response.accessToken,
				);
			} catch (error) {
				// No valid session.
				console.error(
					'Auth initialization failed:',
					error,
				);
			} finally {
				setInitialized();
			}
		};

		void initializeAuth();
	}, [updateTokens, setInitialized]);
}