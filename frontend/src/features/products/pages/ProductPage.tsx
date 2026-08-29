import {
	useEffect,
	useState,
	type FormEvent,
} from 'react';

import Pagination from '../components/Pagination';

import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../../categories/hooks/useCategories';
import { useWishlist } from '../../wishlist/hooks/useWishlist';

import { Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/auth.store';

export default function ProductsPage() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const {
		products,
		meta,
		loading: productsLoading,
		error: productsError,
		loadProducts,
	} = useProducts();

	const {
		categories,
		loading: categoriesLoading,
		error: categoriesError,
		loadCategories,
	} = useCategories();

	const {
		loadWishlist,
		isWishlisted,
		addToWishlist,
		removeFromWishlist,
	} = useWishlist();

	const [page, setPage] = useState(1);

	const [searchInput, setSearchInput] =
		useState('');

	const [search, setSearch] =
		useState('');

	const [
		selectedCategory,
		setSelectedCategory,
	] = useState<string | null>(null);

	const [wishlistLoading, setWishlistLoading] =
		useState<string | null>(null);

	const limit = 10;

	/*
	 * ============================
	 * Load Categories
	 * ============================
	 */

	useEffect(() => {
		void loadCategories();
	}, [loadCategories]);

	/*
	 * ============================
	 * Load Wishlist
	 * ============================
	 */

	useEffect(() => {
		if (!isAuthenticated) {
			return
		}
		void loadWishlist();
	}, [loadWishlist]);

	/*
	 * ============================
	 * Load Products
	 * ============================
	 */

	useEffect(() => {
		void loadProducts({
			page,
			limit,
			search: search || undefined,
			categoryId:
				selectedCategory || undefined,
		});
	}, [
		page,
		search,
		selectedCategory,
		loadProducts,
	]);

	/*
	 * ============================
	 * Search
	 * ============================
	 */

	const handleSearch = (
		event: FormEvent,
	) => {
		event.preventDefault();

		setPage(1);
		setSearch(
			searchInput.trim(),
		);
	};

	/*
	 * ============================
	 * Category
	 * ============================
	 */

	const handleCategorySelect = (
		categoryId: string | null,
	) => {
		setPage(1);
		setSelectedCategory(categoryId);
	};

	/*
	 * ============================
	 * Wishlist Toggle
	 * ============================
	 */

	const handleWishlistToggle = async (
		event: React.MouseEvent<HTMLButtonElement>,
		productId: string,
	) => {
		event.preventDefault();
		event.stopPropagation();

		if (!productId) {
			return;
		}

		if (!isAuthenticated) {
			window.alert(
				'Please login to add products to your wishlist.',
			);

			return;
		}

		try {
			setWishlistLoading(productId);

			if (isWishlisted(productId)) {
				await removeFromWishlist(
					productId,
				);
			} else {
				await addToWishlist({
					productId,
					name: '',
					price: 0
				});
			}
		} catch (error) {
			console.error(
				'Failed to update wishlist:',
				error,
			);
		} finally {
			setWishlistLoading(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">

			{/* ============================ */}
			{/* Categories                   */}
			{/* ============================ */}

			<section className="border-b bg-white">
				<div className="mx-auto max-w-7xl px-6 py-6">

					<h2 className="mb-4 text-xl font-bold">
						Categories
					</h2>

					{categoriesLoading ? (
						<p className="text-gray-500">
							Loading categories...
						</p>
					) : categoriesError ? (
						<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
							{categoriesError}
						</div>
					) : (
						<div className="flex gap-3 overflow-x-auto pb-2">

							<button
								type="button"
								onClick={() =>
									handleCategorySelect(null)
								}
								className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${selectedCategory === null
									? 'bg-black text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
							>
								All
							</button>

							{categories.map(
								(category) => (
									<button
										key={category.id}
										type="button"
										onClick={() =>
											handleCategorySelect(
												category.id,
											)
										}
										className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${selectedCategory ===
											category.id
											? 'bg-black text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
											}`}
									>
										{category.name}
									</button>
								),
							)}

						</div>
					)}

				</div>
			</section>

			{/* ============================ */}
			{/* Products                     */}
			{/* ============================ */}

			<section className="mx-auto max-w-7xl px-6 py-8">

				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

					<h1 className="text-3xl font-bold">
						Products
					</h1>

					<form
						onSubmit={handleSearch}
						className="flex w-full max-w-md gap-2"
					>
						<input
							type="text"
							value={searchInput}
							onChange={(event) =>
								setSearchInput(
									event.target.value,
								)
							}
							placeholder="Search products..."
							className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-black"
						/>

						<button
							type="submit"
							className="rounded-lg bg-black px-5 py-2 font-medium text-white transition hover:bg-gray-800"
						>
							Search
						</button>
					</form>

				</div>

				{productsError && (
					<div className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
						{productsError}
					</div>
				)}

				{productsLoading ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<p className="text-gray-500">
							Loading products...
						</p>
					</div>
				) : products.length === 0 ? (
					<div className="rounded-lg bg-white p-10 text-center">
						<p className="text-gray-500">
							No products found.
						</p>
					</div>
				) : (
					<>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

							{products.map(
								(product) => {
									const wishlisted =
										isWishlisted(
											product.id,
										);

									const wishlistBusy =
										wishlistLoading ===
										product.id;

									return (
										<Link
											key={product.id}
											to={`/products/${product.id}`}
											className="group relative block overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
										>

											{/* Wishlist */}

											<button
												type="button"
												onClick={(
													event,
												) =>
													handleWishlistToggle(
														event,
														product.id,
													)}
												disabled={
													wishlistBusy
												}
												aria-label={
													wishlisted
														? 'Remove from wishlist'
														: 'Add to wishlist'
												}
												className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-md transition hover:scale-110 disabled:opacity-50"
											>
												{wishlistBusy
													? '...'
													: wishlisted
														? '❤️'
														: '♡'}
											</button>

											{/* Image */}

											{product.imageUrl ? (
												<img
													src={
														product.imageUrl
													}
													alt={
														product.name
													}
													className="h-56 w-full object-cover"
												/>
											) : (
												<div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
													No image
												</div>
											)}

											{/* Information */}

											<div className="p-4">

												<h3 className="font-semibold">
													{
														product.name
													}
												</h3>

												<p className="mt-2 line-clamp-2 text-sm text-gray-500">
													{
														product.description
													}
												</p>

												<p className="mt-4 text-lg font-bold">
													AED{' '}
													{product.price.toFixed(
														2,
													)}
												</p>

											</div>

										</Link>
									);
								},
							)}

						</div>

						<Pagination
							page={
								meta?.page ??
								page
							}
							totalPages={
								meta?.totalPages ??
								1
							}
							onPageChange={(
								nextPage,
							) => {
								setPage(nextPage);

								window.scrollTo({
									top: 0,
									behavior: 'smooth',
								});
							}}
						/>
					</>
				)}

			</section>

		</div>
	);
}