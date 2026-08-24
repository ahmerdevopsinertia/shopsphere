import {
	useEffect,
	useState,
} from 'react';

import {
	useOrders,
} from '../hooks/useOrders';

import OrderCard from '../components/OrderCard';

export default function OrdersPage() {
	const {
		orders,
		meta,
		loading,
		error,
		loadOrders,
	} = useOrders();

	const [
		search,
		setSearch,
	] = useState('');

	const [
		activeSearch,
		setActiveSearch,
	] = useState('');

	useEffect(() => {
		void loadOrders(
			1,
			10,
			activeSearch || undefined,
		);
	}, [
		loadOrders,
		activeSearch,
	]);

	const handleSearch =
		(
			event: React.FormEvent,
		) => {
			event.preventDefault();

			setActiveSearch(
				search.trim(),
			);
		};

	const handlePageChange =
		(page: number) => {
			void loadOrders(
				page,
				meta?.limit ?? 10,
				activeSearch ||
				undefined,
			);
		};

	return (
		<div className="mx-auto max-w-6xl p-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-3xl font-bold">
						My Orders
					</h1>

					<p className="mt-1 text-gray-500">
						View your order
						history.
					</p>
				</div>

				<form
					onSubmit={
						handleSearch
					}
					className="flex gap-2"
				>
					<input
						type="text"
						value={search}
						onChange={(
							event,
						) =>
							setSearch(
								event
									.target
									.value,
							)
						}
						placeholder="Search status..."
						className="rounded-lg border px-4 py-2 outline-none focus:ring-2"
					/>

					<button
						type="submit"
						className="rounded-lg bg-black px-4 py-2 text-white"
					>
						Search
					</button>
				</form>
			</div>

			{error && (
				<div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
					{error}
				</div>
			)}

			{loading ? (
				<div className="mt-10 text-center text-gray-500">
					Loading orders...
				</div>
			) : orders.length ===
				0 ? (
				<div className="mt-10 rounded-xl border p-10 text-center">
					<p className="text-gray-500">
						No orders found.
					</p>
				</div>
			) : (
				<div className="mt-8 space-y-4">
					{orders.map(
						(order) => (
							<OrderCard
								key={
									order.id
								}
								order={
									order
								}
							/>
						),
					)}
				</div>
			)}

			{meta &&
				meta.totalPages >
				1 && (
					<div className="mt-8 flex items-center justify-center gap-4">
						<button
							type="button"
							disabled={
								meta.page <=
								1
							}
							onClick={() =>
								handlePageChange(
									meta.page -
									1,
								)
							}
							className="rounded-lg border px-4 py-2 disabled:opacity-40"
						>
							Previous
						</button>

						<span className="text-sm text-gray-600">
							Page{' '}
							{
								meta.page
							}{' '}
							of{' '}
							{
								meta.totalPages
							}
						</span>

						<button
							type="button"
							disabled={
								meta.page >=
								meta.totalPages
							}
							onClick={() =>
								handlePageChange(
									meta.page +
									1,
								)
							}
							className="rounded-lg border px-4 py-2 disabled:opacity-40"
						>
							Next
						</button>
					</div>
				)}
		</div>
	);
}