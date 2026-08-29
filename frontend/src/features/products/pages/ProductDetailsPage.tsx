import {
	useEffect,
	useState,
} from 'react';

import {
	Link,
	useParams,
} from 'react-router-dom';

import { getProduct } from '../api/product.api';
import type { Product } from '../types/product.types';

import { useCart } from '../../cart/hooks/useCart';
import { useWishlist } from '../../wishlist/hooks/useWishlist';
import { useAuthStore } from '../../auth/store/auth.store';

export default function ProductDetailsPage() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	/*
	 * ============================
	 * Cart
	 * ============================
	 */

	const { addItem } = useCart();

	/*
	 * ============================
	 * Wishlist
	 * ============================
	 */

	const {
		loadWishlist,
		isWishlisted,
		addToWishlist,
		removeFromWishlist,
	} = useWishlist();

	/*
	 * ============================
	 * Route Parameters
	 * ============================
	 */

	const { id } = useParams<{
		id: string;
	}>();

	/*
	 * ============================
	 * Local State
	 * ============================
	 */

	const [product, setProduct] =
		useState<Product | null>(null);

	const [loading, setLoading] =
		useState(true);

	const [error, setError] =
		useState('');

	const [addingToCart, setAddingToCart] =
		useState(false);

	const [wishlistLoading, setWishlistLoading] =
		useState(false);

	/*
	 * ============================
	 * Load Wishlist
	 * ============================
	 *
	 * Load the user's wishlist once
	 * when the page is mounted.
	 *
	 * loadWishlist is memoized inside
	 * useWishlist(), so this will NOT
	 * create an infinite render loop.
	 */

	useEffect(() => {
		if(!isAuthenticated) {
			return
		}
		void loadWishlist();
	}, [loadWishlist]);

	/*
	 * ============================
	 * Load Product
	 * ============================
	 */

	useEffect(() => {
		if (!id) {
			setError(
				'Product ID is missing.',
			);

			setLoading(false);

			return;
		}

		const loadProduct = async () => {
			try {
				setLoading(true);
				setError('');

				const data =
					await getProduct(id);

				setProduct(data);
			} catch (error) {
				console.error(
					'Failed to load product:',
					error,
				);

				setError(
					'Unable to load this product.',
				);
			} finally {
				setLoading(false);
			}
		};

		void loadProduct();
	}, [id]);

	/*
	 * ============================
	 * Add To Cart
	 * ============================
	 */

	const handleAddToCart = async () => {
		if (!product) {
			return;
		}

		try {
			setAddingToCart(true);

			await addItem({
				productId: product.id,
				quantity: 1,
			});

			console.log(
				'Product added to cart',
			);
		} catch (error) {
			console.error(
				'Failed to add product to cart:',
				error,
			);
		} finally {
			setAddingToCart(false);
		}
	};

	/*
	 * ============================
	 * Wishlist Toggle
	 * ============================
	 */

	const handleWishlistToggle =
		async () => {
			if (!product) {
				return;
			}

			try {
				setWishlistLoading(true);

				const productId =
					product.id;

				if (
					isWishlisted(productId)
				) {
					await removeFromWishlist(
						productId,
					);
				} else {
					await addToWishlist({
						productId,
					});
				}
			} catch (error) {
				console.error(
					'Failed to update wishlist:',
					error,
				);
			} finally {
				setWishlistLoading(false);
			}
		};

	/*
	 * ============================
	 * Loading
	 * ============================
	 */

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-gray-500">
					Loading product...
				</p>
			</div>
		);
	}

	/*
	 * ============================
	 * Error
	 * ============================
	 */

	if (error || !product) {
		return (
			<div className="mx-auto max-w-7xl p-8">
				<div className="rounded-lg bg-red-50 p-4 text-red-600">
					{error ||
						'Product not found.'}
				</div>
			</div>
		);
	}

	/*
	 * ============================
	 * Wishlist State
	 * ============================
	 */

	const wishlisted =
		isWishlisted(product.id);

	/*
	 * ============================
	 * Render
	 * ============================
	 */

	return (
		<div className="mx-auto max-w-6xl p-6">

			{/* ============================ */}
			{/* Back                        */}
			{/* ============================ */}

			<Link
				to="/products"
				className="mb-6 inline-block text-sm font-medium"
			>
				← Back to Products
			</Link>

			<div className="grid gap-10 md:grid-cols-2">

				{/* ============================ */}
				{/* Product Image               */}
				{/* ============================ */}

				<div className="overflow-hidden rounded-xl bg-gray-100">

					{product.imageUrl ? (
						<img
							src={
								product.imageUrl
							}
							alt={
								product.name
							}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex min-h-[400px] items-center justify-center text-gray-400">
							No image
						</div>
					)}

				</div>

				{/* ============================ */}
				{/* Product Information          */}
				{/* ============================ */}

				<div>

					<div className="flex items-start justify-between gap-4">

						<h1 className="text-3xl font-bold">
							{
								product.name
							}
						</h1>

						{/* ============================ */}
						{/* Wishlist Button              */}
						{/* ============================ */}

						<button
							type="button"
							onClick={
								handleWishlistToggle
							}
							disabled={
								wishlistLoading
							}
							aria-label={
								wishlisted
									? 'Remove from wishlist'
									: 'Add to wishlist'
							}
							className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white text-2xl shadow-sm transition hover:scale-110 disabled:opacity-50"
						>
							{wishlistLoading
								? '...'
								: wishlisted
									? '❤️'
									: '♡'}
						</button>

					</div>

					{/* ============================ */}
					{/* Description                 */}
					{/* ============================ */}

					<p className="mt-4 text-gray-600">
						{
							product.description
						}
					</p>

					{/* ============================ */}
					{/* Price                       */}
					{/* ============================ */}

					<p className="mt-6 text-3xl font-bold">
						AED{' '}
						{product.price.toFixed(
							2,
						)}
					</p>

					{/* ============================ */}
					{/* Stock                       */}
					{/* ============================ */}

					{product.stock !==
						undefined && (
							<p className="mt-3 text-sm text-gray-500">
								Stock:{' '}
								{
									product.stock
								}
							</p>
						)}

					{/* ============================ */}
					{/* Add To Cart                */}
					{/* ============================ */}

					<button
						type="button"
						onClick={
							handleAddToCart
						}
						disabled={
							addingToCart
						}
						className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
					>
						{addingToCart
							? 'Adding...'
							: 'Add to Cart'}
					</button>

				</div>

			</div>
		</div>
	);
}