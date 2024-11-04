import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export const Pagination = ({ table, totalRows }) => {
	const { getState, setPageIndex, getPageCount, previousPage, nextPage, getCanPreviousPage, getCanNextPage } = table;

	const { pageIndex, pageSize } = getState().pagination;
	const totalPageCount = getPageCount();

	const generatePageNumbers = () => {
		const pages = [];
		const maxPageNumbers = 5;
		const halfMaxPageNumbers = Math.floor(maxPageNumbers / 2);

		let startPage = Math.max(pageIndex - halfMaxPageNumbers, 0);
		let endPage = Math.min(startPage + maxPageNumbers - 1, totalPageCount - 1);

		if (endPage - startPage < maxPageNumbers - 1) {
			startPage = Math.max(endPage - maxPageNumbers + 1, 0);
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		return { pages, startPage, endPage };
	};

	const { pages: pageNumbers, startPage, endPage } = generatePageNumbers();

	return (
		<div className='d-flex align-items-center justify-content-between border-top pt-3'>
			{/* Mobile view */}
			<div className='d-flex d-sm-none justify-content-between w-100'>
				<button onClick={() => previousPage()} disabled={!getCanPreviousPage()} className='btn btn-outline-secondary btn-sm'>
					Previous
				</button>
				<button onClick={() => nextPage()} disabled={!getCanNextPage()} className='btn btn-outline-secondary btn-sm ml-2'>
					Next
				</button>
			</div>
			{/* Desktop view */}
			<div className='d-none d-sm-flex w-100 justify-content-between align-items-center'>
				<div>
					<p className='mb-0'>
						Showing <strong>{pageIndex * pageSize + 1}</strong> to <strong>{Math.min((pageIndex + 1) * pageSize, totalRows)}</strong> of <strong>{totalRows}</strong> results
					</p>
				</div>
				<div>
					<nav aria-label='Pagination'>
						<ul className='pagination mb-0'>
							<li className={`page-item ${!getCanPreviousPage() && "disabled"}`}>
								<button className='page-link' onClick={() => previousPage()} aria-label='Previous'>
									<span aria-hidden='true'>
										<ChevronLeftIcon className='h-5 w-5' />
									</span>
								</button>
							</li>

							{/* First page and ellipsis if needed */}
							{startPage > 0 && (
								<>
									<li className={`page-item ${pageIndex === 0 ? "active" : ""}`}>
										<button className='page-link' onClick={() => setPageIndex(0)}>
											1
										</button>
									</li>
									{startPage > 1 && (
										<li className='page-item disabled'>
											<span className='page-link'>...</span>
										</li>
									)}
								</>
							)}

							{/* Page numbers */}
							{pageNumbers.map((pageNumber) => (
								<li key={pageNumber} className={`page-item ${pageIndex === pageNumber ? "active" : ""}`}>
									<button className='page-link' onClick={() => setPageIndex(pageNumber)}>
										{pageNumber + 1}
									</button>
								</li>
							))}

							{/* Ellipsis and last page if needed */}
							{endPage < totalPageCount - 1 && (
								<>
									{endPage < totalPageCount - 2 && (
										<li className='page-item disabled'>
											<span className='page-link'>...</span>
										</li>
									)}
									<li className={`page-item ${pageIndex === totalPageCount - 1 ? "active" : ""}`}>
										<button className='page-link' onClick={() => setPageIndex(totalPageCount - 1)}>
											{totalPageCount}
										</button>
									</li>
								</>
							)}

							<li className={`page-item ${!getCanNextPage() && "disabled"}`}>
								<button className='page-link' onClick={() => nextPage()} aria-label='Next'>
									<span aria-hidden='true'>
										<ChevronRightIcon className='h-5 w-5' />
									</span>
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
};
