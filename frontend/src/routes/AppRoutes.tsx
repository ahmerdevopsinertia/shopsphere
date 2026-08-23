import {
	BrowserRouter,
	Route,
	Routes,
} from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from './ProtectedRoutes';
import OrdersPage from '../features/auth/pages/Orders';
import ProductsPage
	from '../features/products/pages/ProductPage';

import ProductDetailsPage
	from '../features/products/pages/ProductDetailsPage';
import CartPage from '../features/cart/pages/CartPage';
import CheckoutPage from '../features/checkout/pages/Checkout';
import OrderDetailsPage from '../features/orders/pages/OrderDetailsPage';

function Home() {
	return <div>ShopSphere Home</div>;
}

function Register() {
	return <div>Register</div>;
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

					<Route
						path="/products"
						element={<ProductsPage />}
					/>

					<Route
						path="/products/:id"
						element={<ProductDetailsPage />}
					/>

					<Route element={<ProtectedRoute />}>

						<Route
							path="/orders"
							element={<OrdersPage />}
						/>

						<Route
							path="/cart"
							element={<CartPage />}
						/>

						<Route
							path="/orders"
							element={<OrdersPage />}
						/>

						<Route
							path="/orders/:id"
							element={<OrderDetailsPage />}
						/>

						<Route
							path="/checkout"
							element={<CheckoutPage />}
						/>

					</Route>

				</Route>

			</Routes>
		</BrowserRouter>
	);
}