interface OrderStatusProps {
	status: string;
}

export default function OrderStatus({
	status,
}: OrderStatusProps) {
	return (
		<span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
			{status}
		</span>
	);
}