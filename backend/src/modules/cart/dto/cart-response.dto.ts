export class CartResponseDto {
	id: string;
	items: {
		productId: string;
		name: string;
		unitPrice: number;
		quantity: number;
		subtotal: number;
	}[];
	totalAmount: number;
}