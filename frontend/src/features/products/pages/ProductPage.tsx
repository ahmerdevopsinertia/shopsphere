import { useEffect, useState } from 'react';

import { getProducts } from '../api/product.api';
import type { Product } from '../types/product.types';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				setError('');

				const data = await getProducts();

				setProducts(data);
			} catch (error) {
				console.error(
					'Failed to load products:',
					error,
				);

				setError(
					'Unable to load products. Please try again.',
				);
			} finally {
				setLoading(false);
			}
		};

		void loadProducts();
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-gray-500">
					Loading products...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mx-auto max-w-7xl p-8">
				<div className="rounded-lg bg-red-50 p-4 text-red-600">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">
					Products
				</h1>

				<p className="mt-2 text-gray-500">
					Explore our latest products.
				</p>
			</div>

			{products.length === 0 ? (
				<div className="rounded-xl bg-gray-50 p-10 text-center">
					<p className="text-gray-500">
						No products available.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))}
				</div>
			)}
		</div>
	);
}