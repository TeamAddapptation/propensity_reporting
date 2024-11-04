import { useMemo, useState, useEffect } from "react";
import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { Pagination } from "./Pagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const Table = ({ columns, tableData, enableSorting, initialSorting, enablePagination, pageSize, searchText, typeFilter, rowSelection = false, enableExports = false }) => {
	// State for sorting, pagination, and selected rows
	const [sorting, setSorting] = useState(initialSorting || []);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: pageSize || 10,
	});
	const [selectedRows, setSelectedRows] = useState({});

	// Memoized final columns including row selection checkbox if rowSelection is enabled
	const finalColumnDef = useMemo(() => {
		if (rowSelection) {
			return [
				{
					id: "selection",
					header: ({ table }) => <input type='checkbox' checked={table.getIsAllRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />,
					cell: ({ row }) => <input type='checkbox' checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />,
					width: 50,
				},
				...columns,
			];
		}
		return columns;
	}, [columns, rowSelection]);

	// Filter data based on searchText and typeFilter
	const filteredData = useMemo(() => {
		return tableData.filter((row) => {
			if (typeFilter && row.type !== typeFilter) return false;
			if (searchText) {
				const searchString = searchText.toLowerCase();
				return Object.values(row).some((value) => value && value.toString().toLowerCase().includes(searchString));
			}
			return true;
		});
	}, [tableData, searchText, typeFilter]);

	const table = useReactTable({
		columns: finalColumnDef,
		data: filteredData,
		getCoreRowModel: getCoreRowModel(),
		...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
		state: {
			sorting: sorting,
			pagination,
			rowSelection: selectedRows,
		},
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		onRowSelectionChange: setSelectedRows,
		getPaginationRowModel: getPaginationRowModel(),
	});

	useEffect(() => {
		const selectedRowData = table.getSelectedRowModel().rows.map((row) => row.original);
		console.log("Selected Rows:", selectedRowData);
	}, [selectedRows]);

	// Export Functions

	// Export to CSV
	const exportToCSV = () => {
		const headers = columns.map((col) => col.header);
		const rows = filteredData.map((row) =>
			columns.map((col) => {
				let value;
				if (col.accessorFn) {
					value = col.accessorFn(row);
				} else if (col.accessorKey) {
					value = col.accessorKey.split(".").reduce((obj, key) => (obj ? obj[key] : null), row);
				}
				return typeof value === "number" ? value.toString() : value || "";
			})
		);

		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "table_data.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Export to Excel
	const exportToExcel = () => {
		const data = filteredData.map((row) => {
			const rowData = {};
			columns.forEach((col) => {
				let value;
				if (col.accessorFn) {
					value = col.accessorFn(row);
				} else if (col.accessorKey) {
					value = col.accessorKey.split(".").reduce((obj, key) => (obj ? obj[key] : null), row);
				}
				rowData[col.header] = value || "";
			});
			return rowData;
		});

		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const blobData = new Blob([excelBuffer], { type: "application/octet-stream" });
		saveAs(blobData, "table_data.xlsx");
	};

	return (
		<div className='clearfix'>
			{enableExports && (
				<div className='mb-3'>
					<button className='btn btn-primary mr-2' onClick={exportToCSV}>
						Export CSV
					</button>
					<button className='btn btn-primary' onClick={exportToExcel}>
						Export Excel
					</button>
				</div>
			)}
			<div className='overflow-auto'>
				<table className='table table-sm table-striped table-bordered'>
					<thead className='thead-light'>
						{table.getHeaderGroups().map((headerEl) => (
							<tr key={headerEl.id}>
								{headerEl.headers.map((columnEl) => (
									<th
										key={columnEl.id}
										onClick={columnEl.column.getToggleSortingHandler()}
										colSpan={columnEl.colSpan}
										className='text-left font-weight-bold py-2 px-3'
										style={{ width: columnEl.column.columnDef.width }}
									>
										<div className={`d-flex ${columnEl.column.columnDef.centered ? "justify-content-center" : "justify-content-start"} align-items-center`}>
											{columnEl.isPlaceholder ? null : flexRender(columnEl.column.columnDef.header, columnEl.getContext())}
											<span className='ml-2'>
												{columnEl.column.getIsSorted() === "asc" ? (
													<i className='fas fa-sort-up'></i>
												) : columnEl.column.getIsSorted() === "desc" ? (
													<i className='fas fa-sort-down'></i>
												) : (
													columnEl.column.getCanSort() && <i className='fas fa-sort text-muted'></i>
												)}
											</span>
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((rowEl) => (
							<tr key={rowEl.id} className={rowEl.getIsSelected() ? "table-active" : ""}>
								{rowEl.getVisibleCells().map((cellEl) => (
									<td key={cellEl.id} className='py-2 px-3 text-sm' style={{ width: cellEl.column.columnDef.width }}>
										{flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{enablePagination ? <Pagination table={table} totalRows={filteredData.length} /> : null}
		</div>
	);
};

export default Table;
