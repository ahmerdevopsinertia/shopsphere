import {
	useEffect,
} from 'react';

import {
	Link,
	useParams,
} from 'react-router-dom';

import {
	useOrders,
} from '../hooks/useOrders';

import OrderItem from '../components/OrderItem';
import OrderStatus from '../components/OrderStatus';

export default function OrderDetailsPage() {
	const {
		id,
	} = useParams<{
		id: string;
	}>();

	const {
		currentOrder,
		detailLoading,
		error,
		loadOrder,
		clearCurrentOrder,
	} = useOrders();

	useEffect(() => {
		if (!id) {
			return;
		}

		clearCurrentOrder();

		void loadOrder(id);

		return () => {
			clearCurrentOrder();
		};
	}, [
		id,
		loadOrder,
		clearCurrentOrder,
	]);

	if (detailLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-gray-500">
					Loading order...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mx-auto max-w-5xl p-6">
				<div className="rounded-lg bg-red-50 p-4 text-red-600">
					{error}
				</div>

				<Link
					to="/orders"
					className="mt-6 inline-block font-medium"
				>
					← Back to Orders
				</Link>
			</div>
		);
	}

	if (!currentOrder) {
		return (
			<div className="mx-auto max-w-5xl p-6">
				<p className="text-gray-500">
					Order not found.
				</p>

				<Link
					to="/orders"
					className="mt-6 inline-block font-medium"
				>
					← Back to Orders
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl p-6">
			<Link
				to="/orders"
				className="inline-block text-sm font-medium"
			>
				← Back to Orders
			</Link>

			<div className="mt-6">
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div>
						<h1 className="text-3xl font-bold">
							Order Details
						</h1>

						<p className="mt-2 break-all text-sm text-gray-500">
							{
								currentOrder.id
							}
						</p>
					</div>

					<OrderStatus
						status={
							currentOrder.status
						}
					/>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-3">
					<div className="rounded-xl border p-5">
						<p className="text-sm text-gray-500">
							Order Status
						</p>

						<p className="mt-2 font-semibold">
							{
								currentOrder.status
							}
						</p>
					</div>

					<div className="rounded-xl border p-5">
						<p className="text-sm text-gray-500">
							Payment Status
						</p>

						<p className="mt-2 font-semibold">
							{
								currentOrder.paymentStatus
							}
						</p>
					</div>

					<div className="rounded-xl border p-5">
						<p className="text-sm text-gray-500">
							Total
						</p>

						<p className="mt-2 text-xl font-bold">
							AED{' '}
							{Number(currentOrder.totalAmount).toFixed(
								2,
							)}
						</p>
					</div>
				</div>

				<div className="mt-8 rounded-xl border p-6">
					<h2 className="text-xl font-semibold">
						Order Items
					</h2>

					<div className="mt-4">
						{
						currentOrder.items.map(
							(
								item,
							) => (
								<OrderItem
									key={
										item.productId
									}
									item={
										item
									}
								/>
							),
						)}
					</div>
				</div>

				<div className="mt-8 rounded-xl border p-6">
					<h2 className="text-xl font-semibold">
						Payment Information
					</h2>

					<div className="mt-4 space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-500">
								Status
							</span>

							<span className="font-medium">
								{
									currentOrder.paymentStatus
								}
							</span>
						</div>

						<div className="flex justify-between gap-4">
							<span className="text-gray-500">
								Reference
							</span>

							<span className="break-all font-medium">
								{
									currentOrder.paymentReference ??
									'Not available'
								}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}