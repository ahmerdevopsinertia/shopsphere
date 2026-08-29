import { useEffect } from 'react';

import { Link } from 'react-router-dom';

import { useWishlist } from '../hooks/useWishlist';

export default function WishlistPage() {
	const {
		items,
		loading,
		loadWishlist,
		removeFromWishlist,
	} = useWishlist();

	/*
	 * ============================
	 * Load Wishlist
	 * ============================
	 */

	useEffect(() => {
		void loadWishlist();
	}, [loadWishlist]);

	/*
	 * ============================
	 * Render
	 * ============================
	 */

	return (
		<div className="min-h-screen bg-gray-50">

			<section className="mx-auto max-w-7xl px-6 py-8">

				{/* Header */}

				<div className="mb-8">
					<h1 className="text-3xl font-bold">
						My Wishlist
					</h1>

					<p className="mt-2 text-gray-500">
						Products you have saved
						for later.
					</p>
				</div>

				{/* Loading */}

				{loading && items.length === 0 ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<p className="text-gray-500">
							Loading wishlist...
						</p>
					</div>
				) : items.length === 0 ? (
					/* Empty Wishlist */
					<div className="rounded-xl bg-white p-12 text-center shadow-sm">

						<div className="mb-4 text-5xl">
							♡
						</div>

						<h2 className="text-xl font-semibold">
							Your wishlist is empty
						</h2>

						<p className="mt-2 text-gray-500">
							Save products you love
							and find them here
							later.
						</p>

						<Link
							to="/products"
							className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
						>
							Browse Products
						</Link>

					</div>
				) : (
					/* Wishlist Products */
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

						{items.map(
							(item) => (
								<div
									key={
										item.productId
									}
									className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
								>

									{/* Product Image */}

									<Link
										to={`/products/${item.productId}`}
									>
										{item.imageUrl ? (
											<img
												src={
													item.imageUrl
												}
												alt={
													item.name
												}
												className="h-56 w-full object-cover"
											/>
										) : (
											<div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
												No
												image
											</div>
										)}
									</Link>

									{/* Product Information */}

									<div className="p-4">

										<Link
											to={`/products/${item.productId}`}
										>
											<h2 className="font-semibold hover:underline">
												{
													item.name
												}
											</h2>
										</Link>

										<p className="mt-3 text-lg font-bold">
											AED{' '}
											{Number(item.price).toFixed(
												2,
											)}
										</p>

										{/* Remove */}

										<button
											type="button"
											disabled={
												loading
											}
											onClick={() =>
												void removeFromWishlist(
													item.productId,
												)
											}
											className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50"
										>
											♥ Remove from Wishlist
										</button>

										{/* View Product */}

										<Link
											to={`/products/${item.productId}`}
											className="mt-2 block w-full rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-800"
										>
											View Product
										</Link>

									</div>
								</div>
							),
						)}

					</div>
				)}

			</section>
		</div>
	);
}