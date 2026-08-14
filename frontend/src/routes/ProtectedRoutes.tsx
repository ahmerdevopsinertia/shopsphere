import {
	Navigate,
	Outlet,
} from 'react-router-dom';

import { useAuthStore } from '../features/auth/store/auth.store';

export default function ProtectedRoute() {
	const isAuthenticated =
		useAuthStore(
			(state) => state.isAuthenticated,
		);

	const isInitialized =
		useAuthStore(
			(state) => state.isInitialized,
		);

	if (!isInitialized) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-gray-500">
					Loading...
				</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	return <Outlet />;
}