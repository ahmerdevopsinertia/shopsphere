import { useNavigate } from 'react-router-dom';

import { useCart } from '../../cart/hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';

export default function CheckoutPage() {
	const navigate = useNavigate();

	const {
		cart,
		loadCart,
	} = useCart();

	const {
		createOrder,
		loading,
		error,
	} = useCheckout();

	const handleCheckout =
		async () => {
			try {
				const order =
					await createOrder();

				// Synchronize frontend cart
				// with backend after checkout.
				await loadCart();

				// Navigate to confirmation page.
				navigate(
					`/orders/${order.id}`,
				);
			} catch (error) {
				console.error(
					'Order creation failed:',
					error,
				);
			}
		};

	if (!cart) {
		return (
			<div className="mx-auto max-w-5xl p-8">
				<p>
					Loading cart...
				</p>
			</div>
		);
	}

	if (cart.items.length === 0) {
		return (
			<div className="mx-auto max-w-5xl p-8">
				<h1 className="text-2xl font-bold">
					Checkout
				</h1>

				<p className="mt-4 text-gray-500">
					Your cart is empty.
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl p-8">
			<h1 className="text-3xl font-bold">
				Checkout
			</h1>

			<div className="mt-8">
				<h2 className="text-xl font-semibold">
					Order Summary
				</h2>

				<div className="mt-4 space-y-4">
					{cart.items.map(
						(item) => (
							<div
								key={
									item.productId
								}
								className="flex items-center justify-between border-b pb-4"
							>
								<div>
									<p className="font-medium">
										{
											item.name
										}
									</p>

									<p className="text-sm text-gray-500">
										Qty:{' '}
										{
											item.quantity
										}
									</p>
								</div>

								<p className="font-medium">
									AED{' '}
									{item.subtotal.toFixed(
										2,
									)}
								</p>
							</div>
						),
					)}
				</div>

				<div className="mt-8 flex justify-between text-xl font-bold">
					<span>
						Total
					</span>

					<span>
						AED{' '}
						{cart.totalAmount.toFixed(
							2,
						)}
					</span>
				</div>

				{error && (
					<div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
						{error}
					</div>
				)}

				<button
					type="button"
					onClick={
						handleCheckout
					}
					disabled={loading}
					className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
				>
					{loading
						? 'Processing Order...'
						: 'Place Order'}
				</button>
			</div>
		</div>
	);
}