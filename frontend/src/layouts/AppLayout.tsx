import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import { useLogout } from '../features/auth/hooks/useLogout';

export default function AppLayout() {
	const user = useAuthStore((state => state.user));
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const logout = useLogout();

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
									<span>
										{user?.email}
									</span>
									<button type="button" onClick={logout} className="rounded-lg border px-4 py-2 text-sm">
										Logout
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