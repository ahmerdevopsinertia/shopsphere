import { OrderResponseDto } from "./order-response.dto";

export class OrderListResponseDto {
	data: OrderResponseDto[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}