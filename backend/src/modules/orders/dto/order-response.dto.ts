export class OrderResponseDto {
	id: string;
	status: string;
	totalAmount: number;
	items: {
		productId: string;
		quantity: number;
		unitPrice: number;
	}[];

}