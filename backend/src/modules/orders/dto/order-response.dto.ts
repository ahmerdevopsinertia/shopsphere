export class OrderResponseDto {
	id: string;
	status: string;
	paymentStatus: string;
	paymentReference: string | null;
	totalAmount: number;
	items: {
		productId: string;
		productName: string;
		quantity: number;
		unitPrice: number;
	}[];
}