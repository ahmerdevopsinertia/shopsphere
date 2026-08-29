import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import { useLogout } from '../features/auth/hooks/useLogout';
import { useProfile } from '../features/profile/hooks/useProfiles';
import { useEffect } from 'react';

export default function AppLayout() {
	const user = useAuthStore((state => state.user));
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const {
		handleLogout,
		loading: logoutLoading,
	} = useLogout();

	const {
		loadProfile,
		profile,
	} = useProfile();

	useEffect(() => {
		if (!isAuthenticated) {
			return;
		}
		void loadProfile();
	}, [
		isAuthenticated,
		loadProfile,
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="border-b bg-white">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<Link
						to="/"
						className="text-xl font-bold text-gray-900"
					>
						ShopSphere
					</Link>
					<nav className="flex items-center gap-6">
						{
							isAuthenticated ? (
								<>
									<Link to="/products">Products</Link>
									<Link to="/orders">Orders</Link>
									<Link to="/cart">Cart</Link>
									<Link
										to="/profile"
										className="text-sm font-medium text-gray-700 hover:text-black"
									>
										Profile
									</Link>
									<Link to="/wishlist">
										Wishlist
									</Link>
									<span>
										{profile
											? `${profile.firstName} ${profile.lastName}`
											: user?.email}
									</span>
									<button
										type="button"
										onClick={handleLogout}
										disabled={logoutLoading}
										className="flex min-w-[90px] items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
									>
										{logoutLoading ? (
											<>
												<span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
												<span>Logging out...</span>
											</>
										) : (
											'Logout'
										)}
									</button>
								</>
							)
								: (
									<>
										<Link to="/login">Login</Link>
										<Link to="/register">Register</Link>
										<Link to="/products">Products</Link>
									</>
								)}
					</nav>
				</div>
			</header>

			<main>
				<Outlet />
			</main>

			<footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
				ShopSphere
			</footer>
		</div>
	);
}