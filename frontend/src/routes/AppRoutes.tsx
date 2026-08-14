import {
	BrowserRouter,
	Route,
	Routes,
} from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from './ProtectedRoutes';
import OrdersPage from '../features/auth/pages/Orders';

function Home() {
	return <div>ShopSphere Home</div>;
}

function Register() {
	return <div>Register</div>;
}

function Products() {
	return <div>Products</div>;
}

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>

				<Route element={<AppLayout />}>

					<Route
						path="/"
						element={<Home />}
					/>

					<Route
						path="/login"
						element={<LoginPage />}
					/>

					<Route
						path="/register"
						element={<Register />}
					/>

					<Route>

						<Route
							path="/products"
							element={<Products />}
						/>

					</Route>

					<Route element={<ProtectedRoute />}>

						<Route
							path="/orders"
							element={<OrdersPage />}
						/>

					</Route>

				</Route>

			</Routes>
		</BrowserRouter>
	);
}