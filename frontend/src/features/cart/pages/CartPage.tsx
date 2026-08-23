import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../hooks/useCart';


export default function CartPage() {
	const navigate = useNavigate();
	const {
		cart,
		loadCart,
		updateItemQuantity,
		removeCartItems,
		removeCart,
	} = useCart();

	const [loadingCart, setLoadingCart] =
		useState(true);

	const [updatingProductId, setUpdatingProductId] =
		useState<string | null>(null);

	const [error, setError] = useState('');

	useEffect(() => {
		const initializeCart = async () => {
			try {
				setLoadingCart(true);
				setError('');

				await loadCart();
			} catch (error) {
				console.error(
					'Failed to load cart:',
					error,
				);

				setError(
					'Unable to load your cart.',
				);
			} finally {
				setLoadingCart(false);
			}
		};

		void initializeCart();
	}, []);

	const handleQuantityChange = async (
		productId: string,
		quantity: number,
	) => {
		if (quantity < 1) {
			return;
		}

		try {
			setUpdatingProductId(productId);
			setError('');

			await updateItemQuantity(
				productId,
				{ quantity },
			);
		} catch (error) {
			console.error(
				'Failed to update cart quantity:',
				error,
			);

			setError(
				'Unable to update cart quantity.',
			);
		} finally {
			setUpdatingProductId(null);
		}
	};

	const handleRemoveCartItems = async (productId: string,) => {
		try {
			setError('');

			await removeCartItems(productId);
		} catch (error) {
			console.error(
				'Failed to remove cart:',
				error,
			);

			setError(
				'Unable to clear your cart.',
			);
		}
	};

	const handleRemoveCart = async () => {
		try {
			setError('');

			await removeCart();
		} catch (error) {
			console.error(
				'Failed to remove cart:',
				error,
			);

			setError(
				'Unable to clear your cart.',
			);
		}
	};

	if (loadingCart) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-gray-500">
					Loading cart...
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">
						Your Cart
					</h1>

					<p className="mt-1 text-sm text-gray-500">
						Review your items before checkout.
					</p>
				</div>

				<Link
					to="/products"
					className="text-sm font-medium"
				>
					← Continue Shopping
				</Link>
			</div>

			{error && (
				<div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
					{error}
				</div>
			)}

			{!cart || cart.items.length === 0 ? (
				<div className="rounded-xl border bg-white p-10 text-center">
					<h2 className="text-xl font-semibold">
						Your cart is empty
					</h2>

					<p className="mt-2 text-gray-500">
						Add some products to get started.
					</p>

					<Link
						to="/products"
						className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white"
					>
						Browse Products
					</Link>
				</div>
			) : (
				<div className="grid gap-8 lg:grid-cols-[1fr_320px]">
					<div className="space-y-4">
						{cart.items.map((item) => {
							const updating =
								updatingProductId ===
								item.productId;

							return (
								<div
									key={item.productId}
									className="rounded-xl border bg-white p-5"
								>
									<div className="flex items-center justify-between gap-6">
										<div>
											<h2 className="font-semibold">
												{item.name}
											</h2>

											<p className="mt-1 text-sm text-gray-500">
												AED{' '}
												{item.unitPrice.toFixed(
													2,
												)}{' '}
												each
											</p>
										</div>

										<div className="text-right">
											<p className="font-semibold">
												AED{' '}
												{item.subtotal.toFixed(
													2,
												)}
											</p>
										</div>
									</div>

									<div className="mt-4 flex items-center justify-between">
										<div className="flex items-center gap-3">
											<button
												type="button"
												disabled={
													updating ||
													item.quantity <= 1
												}
												onClick={() =>
													void handleQuantityChange(
														item.productId,
														item.quantity -
														1,
													)
												}
												className="h-9 w-9 rounded-lg border disabled:opacity-40"
											>
												−
											</button>

											<span className="min-w-6 text-center">
												{item.quantity}
											</span>

											<button
												type="button"
												disabled={updating}
												onClick={() =>
													void handleQuantityChange(
														item.productId,
														item.quantity +
														1,
													)
												}
												className="h-9 w-9 rounded-lg border disabled:opacity-40"
											>
												+
											</button>
										</div>

										{updating && (
											<span className="text-xs text-gray-500">
												Updating...
											</span>
										)}
									</div>

									<button
										type="button"
										onClick={() =>
											void handleRemoveCartItems(item.productId)
										}
										className="mt-3 w-full rounded-lg border px-6 py-3 text-sm font-medium text-red-600"
									>
										Remove
									</button>
								</div>
							);
						})}
					</div>

					<div className="h-fit rounded-xl border bg-white p-6">
						<h2 className="text-lg font-semibold">
							Order Summary
						</h2>

						<div className="mt-6 flex justify-between">
							<span className="text-gray-500">
								Subtotal
							</span>

							<span className="font-medium">
								AED{' '}
								{cart.totalAmount.toFixed(
									2,
								)}
							</span>
						</div>

						<div className="my-4 border-t" />

						<div className="flex justify-between text-lg font-bold">
							<span>Total</span>

							<span>
								AED{' '}
								{cart.totalAmount.toFixed(
									2,
								)}
							</span>
						</div>

						<button
							type="button"
							className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-medium text-white"
							onClick={() =>
								navigate('/checkout')
							}
						>
							Proceed to Checkout
						</button>

						{/* <button
							type="button"
							onClick={() =>
								void handleRemoveCart()
							}
							className="mt-3 w-full rounded-lg border px-6 py-3 text-sm font-medium text-red-600"
						>
							Clear Cart
						</button> */}
					</div>
				</div>
			)}
		</div>
	);
}