export type OrderStatus =
	| 'PENDING'
	| 'PAID'
    | 'CONFIRMED'
	| 'PROCESSING'
	| 'SHIPPED'
	| 'DELIVERED'
	| 'CANCELLED';
    
export type PaymentStatus =
	| 'PENDING'
	| 'PAID'
	| 'FAILED'
	| 'REFUNDED';

export interface CheckoutItem {
	productId: string;
	quantity: number;
	unitPrice: number;
}

export interface CheckoutResponse {
	id: string;
	status: OrderStatus;
	totalAmount: number;
	paymentStatus: PaymentStatus;
	paymentReference: string | null;
	items: CheckoutItem[];
}