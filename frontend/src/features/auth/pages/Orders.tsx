import { useEffect, useState, type FormEvent } from "react";
import { orders } from "../api/auth.api";

export default function OrdersPage() {
	// useEffect(() => {
	// 	orders()
	// 		.then(() => console.log('Orders API called'))
	// 		.catch((error: any) => {
	// 			console.error('Orders API unavailable:', error);
	// 		});
	// }, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		orders()
			.then(() => console.log('Orders API called'))
			.catch((error: any) => {
				console.error('Orders API unavailable:', error);
			});
	}
	return (
		<div className="p-8">
			<h1>Orders</h1>

			<form onSubmit={(handleSubmit)} className="space-y-4">
				<button type="submit">
					Your Orders
				</button>
			</form>
		</div>
	);
}