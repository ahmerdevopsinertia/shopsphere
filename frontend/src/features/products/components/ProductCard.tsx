import type { Product } from '../types/product.types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({
	product,
}: ProductCardProps) {
	return (
		<Link
			to={`/products/${product.id}`}
			className="group overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
		>
			<div className="aspect-square bg-gray-100">
				{product.imageUrl ? (
					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-full w-full object-cover transition group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-gray-400">
						No image
					</div>
				)}
			</div>

			<div className="p-4">
				<h2 className="font-semibold text-gray-900">
					{product.name}
				</h2>

				<p className="mt-1 line-clamp-2 text-sm text-gray-500">
					{product.description}
				</p>

				<p className="mt-3 text-lg font-bold text-gray-900">
					AED {product.price.toFixed(2)}
				</p>
			</div>
		</Link>
	);
}