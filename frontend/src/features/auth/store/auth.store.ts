import { create } from 'zustand';

import type { AuthUser } from '../types/auth.types';
import { authStorage } from '../utils/auth-storage';

interface AuthState {
	user: AuthUser | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isInitialized: boolean;

	setAuth: (
		user: AuthUser,
		accessToken: string,
		refreshToken?: string
	) => void;

	updateTokens: (accessToken: string, refreshToken: string) => void

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

		setAuth: (user, accessToken, refreshToken) => {
			authStorage.setAccessToken(accessToken);

			if (refreshToken) {
				authStorage.setRefreshToken(refreshToken);
			}

			set({
				user,
				accessToken,
				isAuthenticated: true,
				refreshToken: refreshToken ?? null,
			})
		},
		updateTokens: (accessToken, refreshToken) => {
			authStorage.setAccessToken(accessToken);
			authStorage.setRefreshToken(refreshToken);

			set({
				accessToken,
				refreshToken,
				isAuthenticated: true,
			});
		},

		clearAuth: () => {
			set({
				user: null,
				accessToken: null,
				refreshToken: null,
				isAuthenticated: false,
			});
		},

		setInitialized: () =>
			set({
				isInitialized: true,
			}),
	}));