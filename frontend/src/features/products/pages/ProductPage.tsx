import {
	useEffect,
	useState,
	type FormEvent,
} from 'react';

import Pagination from '../components/Pagination';

import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../../categories/hooks/useCategories';

import { Link } from 'react-router-dom';

export default function ProductsPage() {
	/*
	 * ============================
	 * Products
	 * ============================
	 */

	const {
		products,
		meta,
		loading: productsLoading,
		error: productsError,
		loadProducts,
	} = useProducts();

	/*
	 * ============================
	 * Categories
	 * ============================
	 */

	const {
		categories,
		loading: categoriesLoading,
		error: categoriesError,
		loadCategories,
	} = useCategories();

	/*
	 * ============================
	 * Local UI State
	 * ============================
	 */

	const [page, setPage] =
		useState(1);

	const [searchInput, setSearchInput] =
		useState('');

	const [search, setSearch] =
		useState('');

	const [
		selectedCategory,
		setSelectedCategory,
	] = useState<string | null>(null);

	const limit = 10;

	/*
	 * ============================
	 * Load Categories
	 * ============================
	 *
	 * Categories are loaded once
	 * when the page is mounted.
	 */

	useEffect(() => {
		void loadCategories();
	}, [loadCategories]);

	/*
	 * ============================
	 * Load Products
	 * ============================
	 *
	 * Products are reloaded when:
	 *
	 * - page changes
	 * - search changes
	 *
	 * Current backend supports:
	 *
	 * page
	 * limit
	 * search
	 *
	 * Category filtering will be
	 * connected once backend supports
	 * categoryId/categorySlug.
	 */

	useEffect(() => {
		void loadProducts({
			page,
			limit,
			search: search || undefined,
		});
	}, [
		page,
		search,
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

		/*
		 * Always return to page 1
		 * when a new search is performed.
		 */

		setPage(1);

		setSearch(
			searchInput.trim(),
		);
	};

	/*
	 * ============================
	 * Category Selection
	 * ============================
	 *
	 * At the moment this only changes
	 * the selected UI state.
	 *
	 * It does NOT call the Product API
	 * because the backend ProductQueryDto
	 * currently does not support category
	 * filtering.
	 */

	const handleCategorySelect = (
		categoryId: string | null,
	) => {
		setSelectedCategory(
			categoryId,
		);
	};

	/*
	 * ============================
	 * Render
	 * ============================
	 */

	return (
		<div className="min-h-screen bg-gray-50">

			{/* ================================= */}
			{/* Categories Section                */}
			{/* ================================= */}

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

							{/* All Categories */}

							<button
								type="button"
								onClick={() =>
									handleCategorySelect(
										null,
									)
								}
								className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${selectedCategory ===
									null
									? 'bg-black text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
							>
								All
							</button>

							{/* Categories */}

							{categories.map(
								(category) => (
									<button
										key={
											category.id
										}
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
										{
											category.name
										}
									</button>
								),
							)}

						</div>
					)}

				</div>
			</section>

			{/* ================================= */}
			{/* Products Section                  */}
			{/* ================================= */}

			<section className="mx-auto max-w-7xl px-6 py-8">

				{/* ================================= */}
				{/* Header + Search                  */}
				{/* ================================= */}

				<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

					<h1 className="text-3xl font-bold">
						Products
					</h1>

					<form
						onSubmit={
							handleSearch
						}
						className="flex w-full max-w-md gap-2"
					>

						<input
							type="text"
							value={
								searchInput
							}
							onChange={(
								event,
							) =>
								setSearchInput(
									event.target
										.value,
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

				{/* ================================= */}
				{/* Selected Category Notice         */}
				{/* ================================= */}

				{selectedCategory && (
					<div className="mb-5 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
						Category filtering will be
						connected once the Product
						API supports category
						filtering.
					</div>
				)}

				{/* ================================= */}
				{/* Product Error                    */}
				{/* ================================= */}

				{productsError && (
					<div className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
						{productsError}
					</div>
				)}

				{/* ================================= */}
				{/* Product Loading                  */}
				{/* ================================= */}

				{productsLoading ? (
					<div className="flex min-h-[300px] items-center justify-center">
						<p className="text-gray-500">
							Loading products...
						</p>
					</div>
				) : products.length ===
					0 ? (
					<div className="rounded-lg bg-white p-10 text-center">
						<p className="text-gray-500">
							No products found.
						</p>
					</div>
				) : (
					<>
						{/* ================================= */}
						{/* Product Grid                   */}
						{/* ================================= */}

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

							{products.map(
								(product) => (
									<Link
										key={product.id}
										to={`/products/${product.id}`}
										className="block overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
									>
										{/* Product Image */}

										{product.imageUrl ? (
											<img
												src={product.imageUrl}
												alt={product.name}
												className="h-56 w-full object-cover"
											/>
										) : (
											<div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
												No image
											</div>
										)}

										{/* Product Information */}

										<div className="p-4">
											<h3 className="font-semibold">
												{product.name}
											</h3>

											<p className="mt-2 line-clamp-2 text-sm text-gray-500">
												{product.description}
											</p>

											<p className="mt-4 text-lg font-bold">
												AED {product.price.toFixed(2)}
											</p>
										</div>
									</Link>
								),
							)}

						</div>

						{/* ================================= */}
						{/* Pagination                      */}
						{/* ================================= */}

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
								setPage(
									nextPage,
								);

								/*
								 * Scroll to the
								 * beginning of
								 * the product
								 * section.
								 */

								window.scrollTo({
									top: 0,
									behavior:
										'smooth',
								});
							}}
						/>

					</>
				)}

			</section>

		</div>
	);
}