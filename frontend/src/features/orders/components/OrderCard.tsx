import {
	Link,
} from 'react-router-dom';

import type {
	Order,
} from '../types/order.types';

import OrderStatus from './OrderStatus';

interface OrderCardProps {
	order: Order;
}

export default function OrderCard({
	order,
}: OrderCardProps) {
	return (
		<div className="rounded-xl border bg-white p-6 shadow-sm">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<p className="text-sm text-gray-500">
						Order ID
					</p>

					<p className="mt-1 break-all font-medium">
						{order.id}
					</p>
				</div>

				<OrderStatus
					status={order.status}
				/>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				<div>
					<p className="text-sm text-gray-500">
						Total
					</p>

					<p className="mt-1 font-semibold">
						AED{' '}
						{order.totalAmount.toFixed(
							2,
						)}
					</p>
				</div>

				<div>
					<p className="text-sm text-gray-500">
						Payment
					</p>

					<p className="mt-1 font-medium">
						{
							order.paymentStatus
						}
					</p>
				</div>

				<div>
					<p className="text-sm text-gray-500">
						Items
					</p>

					<p className="mt-1 font-medium">
						{
							order.items
								.length
						}
					</p>
				</div>
			</div>

			<div className="mt-6">
				<Link
					to={`/orders/${order.id}`}
					className="inline-block rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
				>
					View Order
				</Link>
			</div>
		</div>
	);
}