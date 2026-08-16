import { create } from 'zustand';

import type { AuthUser } from '../types/auth.types';
import { authStorage } from '../utils/auth-storage';

interface AuthState {
	user: AuthUser | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isInitialized: boolean;

	setAuth: (
		user: AuthUser,
		accessToken: string
	) => void;

	updateTokens: (accessToken: string) => void

	clearAuth: () => void;

	setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => (
	{
		user: null,

		accessToken: authStorage.getAccessToken(),
		refreshToken: null,
		isAuthenticated: !!authStorage.getAccessToken(),
		isInitialized: false,

		setAuth: (user, accessToken) => {
			authStorage.setAccessToken(accessToken);
			set({
				user,
				accessToken,
				isAuthenticated: true,
			})
		},
		updateTokens: (accessToken) => {
			authStorage.setAccessToken(accessToken);

			set({
				accessToken,
				isAuthenticated: true,
			});
		},

		clearAuth: () => {
			authStorage.clear();
			set({
				user: null,
				accessToken: null,
				isAuthenticated: false,
			});
		},

		setInitialized: () =>
			set({
				isInitialized: true,
			}),
	}));