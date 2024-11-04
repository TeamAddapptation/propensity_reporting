import { useQuery } from "@tanstack/react-query";
import Table from "../../components/table/Table";

const fetchReport = async () => {
	const response = await fetch(`https://t-propensity-api.addapptation.com/demo_data?api_key=6d5b9cb6-d85e-43c8-a892-b9c18dd77bac`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};

export default function ROITracker() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["campaignAnalytics"],
		queryFn: fetchReport,
	});

	if (isLoading) return <p>Data Loading</p>;
	if (error) return <p>{error.message}</p>;

	const roiColumns = [
		{
			accessorKey: "name",
			id: "name",
			header: "Campaign Name",
		},
		{
			accessorKey: "channel",
			id: "channel",
			header: "Channel",
		},
		{
			accessorKey: "type",
			id: "type",
			header: "Type",
		},
		{
			accessorKey: "targetAudience",
			id: "targetAudience",
			header: "Target Audience",
		},
		{
			accessorKey: "spend",
			id: "spend",
			header: "Spend ($)",
			width: "150px",
			cell: ({ row }) => `$${row.original.spend.toLocaleString()}`,
		},
		{
			accessorKey: "metrics.impressions",
			id: "impressions",
			header: "Impressions",
			cell: ({ row }) => row.original.metrics.impressions?.toLocaleString() || "-",
		},
		{
			accessorKey: "metrics.clicks",
			id: "clicks",
			header: "Clicks",
			cell: ({ row }) => row.original.metrics.clicks?.toLocaleString() || "-",
		},
		{
			accessorKey: "metrics.conversions",
			id: "conversions",
			header: "Conversions",
			cell: ({ row }) => row.original.metrics.conversions?.toLocaleString() || "-",
		},
		{
			accessorKey: "metrics.roi",
			id: "roi",
			header: "ROI",
		},
		{
			accessorKey: "dates.startDate",
			id: "startDate",
			header: "Start Date",
			width: "150px",
		},
		{
			accessorKey: "dates.endDate",
			id: "endDate",
			header: "End Date",
			width: "150px",
		},
	];

	console.log("Reporting Data: ", data);

	return (
		<div>
			<Table
				columns={roiColumns}
				tableData={data.report.campaigns}
				enableSorting={true}
				searchText={""}
				initialSorting={[{ id: "name", desc: false }]}
				enablePagination={true}
				pageSize={10}
				enableExports={true}
			/>
		</div>
	);
}
