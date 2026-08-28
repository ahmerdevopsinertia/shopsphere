import type {
	OrderItem as OrderItemType,
} from '../types/order.types';

interface OrderItemProps {
	item: OrderItemType;
}

export default function OrderItem({
	item,
}: OrderItemProps) {
	return (
		<div className="flex items-center justify-between border-b py-4 last:border-b-0">
			<div>
				<p className="font-medium">
					Product
				</p>

				<p className="text-sm text-gray-500">
					{item.product.name}
				</p>

				<p className="mt-1 text-sm text-gray-500">
					Quantity: {item.quantity}
				</p>
			</div>

			<div className="text-right">
				<p className="font-medium">
					AED{' '}
					{Number(item.unitPrice).toFixed(
						2,
					)}
				</p>

				<p className="text-sm text-gray-500">
					Subtotal: AED{' '}
					{(
						item.unitPrice *
						item.quantity
					).toFixed(2)}
				</p>
			</div>
		</div>
	);
}