interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (
		page: number,
	) => void;
}

export default function Pagination({
	page,
	totalPages,
	onPageChange,
}: PaginationProps) {

	if (totalPages <= 1) {
		return null;
	}

	const handlePrevious = () => {
		if (page > 1) {
			onPageChange(page - 1);
		}
	};

	const handleNext = () => {
		if (page < totalPages) {
			onPageChange(page + 1);
		}
	};

	return (
		<div className="mt-10 flex items-center justify-center gap-2">

			<button
				type="button"
				onClick={
					handlePrevious
				}
				disabled={page === 1}
				className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
			>
				Previous
			</button>

			<div className="flex items-center gap-1">

				{Array.from(
					{
						length: totalPages,
					},
					(_, index) => {
						const pageNumber =
							index + 1;

						return (
							<button
								key={
									pageNumber
								}
								type="button"
								onClick={() =>
									onPageChange(
										pageNumber,
									)
								}
								className={`h-9 min-w-9 rounded-lg px-3 text-sm ${pageNumber ===
										page
										? 'bg-black text-white'
										: 'border hover:bg-gray-100'
									}`}
							>
								{
									pageNumber
								}
							</button>
						);
					},
				)}

			</div>

			<button
				type="button"
				onClick={
					handleNext
				}
				disabled={
					page === totalPages
				}
				className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
			>
				Next
			</button>

		</div>
	);
}