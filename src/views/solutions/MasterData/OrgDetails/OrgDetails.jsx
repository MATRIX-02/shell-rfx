import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import {
	Box,
	IconButton,
	Tooltip,
	Typography,
	Divider,
	Checkbox,
} from "@mui/material";
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Business as BusinessIcon,
	LocationOn as LocationOnIcon,
	Warehouse as WarehouseIcon,
	Edit as EditIcon,
} from "@mui/icons-material";
import {
	MaterialReactTable,
	useMaterialReactTable,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFullScreenButton,
	MRT_ShowHideColumnsButton,
	MRT_ToggleFiltersButton,
	MRT_ActionMenuItem,
} from "material-react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";

import EntryDialog from "./EntryDialog";
import useOrgDetails from "hooks/MasterData/useOrgDetails";

const OrgDetails = () => {
	const {
		companyData,
		siteData,
		warehouseData,
		loading,
		error,
		createCompany,
		updateCompany,
		deleteCompany,
		createSite,
		updateSite,
		deleteSite,
		createWarehouse,
		updateWarehouse,
		deleteWarehouse,
	} = useOrgDetails(); // Use the custom hook
	const [dialogOpen, setDialogOpen] = useState(false);
	const [currentData, setCurrentData] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const [currentType, setCurrentType] = useState(null);

	const handleOpenDialog = (type, data = {}, editing = false) => {
		setCurrentType(type);
		setCurrentData(data);
		setIsEditing(editing);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setCurrentData({});
		setIsEditing(false);
		setCurrentType(null);
	};

	const handleSaveDialog = async () => {
		const dataToSend = { ...currentData };

		// Ensure all fields are included, even if they're not set
		const fieldsToInclude =
			currentType === "company"
				? companyFields
				: currentType === "site"
					? siteFields
					: warehouseFields;

		fieldsToInclude.forEach((field) => {
			const keys = field.key.split(".");
			if (keys.length === 1) {
				if (!(field.key in dataToSend)) {
					dataToSend[field.key] = field.type === "checkbox" ? false : "";
				}
			} else if (keys.length === 2) {
				if (!(keys[0] in dataToSend)) {
					dataToSend[keys[0]] = {};
				}
				if (!(keys[1] in dataToSend[keys[0]])) {
					dataToSend[keys[0]][keys[1]] = field.type === "checkbox" ? false : "";
				}
			}
		});

		switch (currentType) {
			case "company":
				if (isEditing) {
					await updateCompany(currentData.company_id, dataToSend);
				} else {
					await createCompany(dataToSend);
				}
				break;
			case "site":
				if (isEditing) {
					await updateSite(currentData.site_id, dataToSend);
				} else {
					await createSite(dataToSend);
				}
				break;
			case "warehouse":
				if (isEditing) {
					await updateWarehouse(currentData.warehouse_id, dataToSend);
				} else {
					await createWarehouse(dataToSend);
				}
				break;
			default:
				return;
		}

		handleCloseDialog();
	};

	const csvConfig = mkConfig({
		fieldSeparator: ",",
		decimalSeparator: ".",
		useKeysAsHeaders: true,
	});

	const flattenObject = (obj, prefix = "") => {
		return Object.keys(obj).reduce((acc, k) => {
			const pre = prefix.length ? prefix + "." : "";
			if (
				typeof obj[k] === "object" &&
				obj[k] !== null &&
				!Array.isArray(obj[k])
			) {
				Object.assign(acc, flattenObject(obj[k], pre + k));
			} else {
				acc[pre + k] = obj[k];
			}
			return acc;
		}, {});
	};

	const handleExportRows = (table) => {
		const rowData = table
			.getCoreRowModel()
			.rows.map((row) => flattenObject(row.original));
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	};

	const companyFields = [
		{ key: "company_name", label: "Company Name" },
		{ key: "address.country", label: "Country" },
		{ key: "address.state", label: "State" },
		{ key: "address.city", label: "City" },
		{ key: "address.street", label: "Street" },
		{ key: "address.zipcode", label: "Zipcode" },
		{ key: "email", label: "Email" },
		{ key: "headquarter", label: "Headquarter", type: "checkbox" },
		{ key: "active_status", label: "Active Status", type: "checkbox" },
	];

	const siteFields = [
		{ key: "site_name", label: "Site Name" },
		{ key: "address.street", label: "Street" },
		{ key: "address.city", label: "City" },
		{ key: "address.state", label: "State" },
		{ key: "address.zipcode", label: "Zipcode" },
		{ key: "address.country", label: "Country" },
		{ key: "active_status", label: "Active Status", type: "checkbox" },
	];

	const warehouseFields = [
		{ key: "warehouse_name", label: "Warehouse Name" },
		{ key: "address.street", label: "Street" },
		{ key: "address.city", label: "City" },
		{ key: "address.state", label: "State" },
		{ key: "address.zipcode", label: "Zipcode" },
		{ key: "address.country", label: "Country" },
		{ key: "same_as_site", label: "Same as Site", type: "checkbox" },
		{ key: "active_status", label: "Active Status", type: "checkbox" },
	];

	const createTableInstance = (data, title, icon, columns, deleteFunction) => {
		return useMaterialReactTable({
			columns,
			data,
			state: {
				isLoading: loading,
				showAlertBanner: error,
				showProgressBars: loading,
				showLoadingOverlay: false,
			},
			enableColumnOrdering: true,
			enableBottomToolbar: true,
			enableStickyHeader: true,
			enableColumnPinning: true,
			initialState: {
				showGlobalFilter: true,
				columnPinning: { right: ["mrt-row-actions"] },
			},
			enablePagination: true,
			enableGlobalFilterModes: true,
			globalFilterFn: ["contains"],
			positionGlobalFilter: "left",
			muiSearchTextFieldProps: {
				placeholder: `Search forms`,
				sx: { minWidth: "300px" },
				variant: "outlined",
			},
			muiPaginationProps: {
				color: "primary",
				shape: "rounded",
				showRowsPerPage: false,
				variant: "outlined",
			},
			paginationDisplayMode: "pages",
			enableColumnFilters: true,
			enableRowActions: true,
			positionActionsColumn: "last",
			renderToolbarInternalActions: ({ table }) => (
				<Box>
					<Tooltip title={`Add New ${title}`}>
						<IconButton onClick={() => handleOpenDialog(title.toLowerCase())}>
							<AddIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Export All Rows">
						<IconButton onClick={() => handleExportRows(table)}>
							<IconTableExport />
						</IconButton>
					</Tooltip>
					<Tooltip title="Import CSV">
						<IconButton>
							<IconTableImport />
						</IconButton>
					</Tooltip>
					<MRT_ToggleFiltersButton table={table} />
					<MRT_ShowHideColumnsButton table={table} />
					<MRT_ToggleDensePaddingButton table={table} />
					<MRT_ToggleFullScreenButton table={table} />
				</Box>
			),
			renderRowActionMenuItems: ({ row, table }) => [
				<MRT_ActionMenuItem
					key="edit"
					icon={<EditIcon />}
					label="Edit"
					onClick={() =>
						handleOpenDialog(title.toLowerCase(), row.original, true)
					}
					table={table}
				/>,
				<MRT_ActionMenuItem
					key="delete"
					icon={<DeleteIcon />}
					label="Delete"
					onClick={() => {
						if (window.confirm("Are you sure you want to delete this?")) {
							deleteFunction(
								row.original.company_id ||
									row.original.site_id ||
									row.original.warehouse_id
							);
						}
					}}
					table={table}
				/>,
			],
			mrtTheme: (theme) => ({
				matchHighlightColor: "#FF9632",
			}),
			muiTableContainerProps: {
				sx: {
					maxHeight: 500,
					minHeight: 500,
					border: "1px solid #ddd",
				},
			},
			muiTableHeadCellProps: {
				sx: {
					backgroundColor: "#f9f9f9",
					fontWeight: "400",
					fontSize: "1rem",
				},
			},
			muiTablePaperProps: {
				sx: {
					boxShadow: "none",
					position: "relative",
				},
			},
		});
	};

	const companyColumns = [
		{
			accessorKey: "company_name",
			header: "Company",
			size: 200,
			enableEditing: true,
		},
		{
			accessorKey: "address.country",
			header: "Country",
			size: 150,
			enableEditing: true,
		},
		{
			accessorKey: "address.state",
			header: "State",
			size: 150,
			enableEditing: true,
		},
		{
			accessorKey: "address.city",
			header: "City",
			size: 150,
			enableEditing: true,
		},
		{
			accessorKey: "address.street",
			header: "Street",
			size: 200,
			enableEditing: true,
		},
		{
			accessorKey: "address.zipcode",
			header: "Zipcode",
			size: 100,
			enableEditing: true,
		},
		{
			accessorKey: "email",
			header: "Email",
			size: 200,
			enableEditing: true,
		},
		{
			accessorKey: "headquarter",
			header: "Headquarter",
			size: 120,
			enableEditing: true,
			Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
		},
		{
			accessorKey: "active_status",
			header: "Active",
			size: 100,
			enableEditing: true,
			muiEditTextFieldProps: {
				type: "checkbox",
			},
			Cell: ({ cell }) => <Checkbox checked={cell.getValue()} disabled />,
		},
	];

	const siteColumns = [
		{
			accessorKey: "site_name",
			header: "Site Name",
			size: 200,
		},
		{
			accessorKey: "address.street",
			header: "Street",
			size: 200,
		},
		{
			accessorKey: "address.city",
			header: "City",
			size: 150,
		},
		{
			accessorKey: "address.state",
			header: "State",
			size: 100,
		},
		{
			accessorKey: "address.zipcode",
			header: "Zipcode",
			size: 100,
		},
		{
			accessorKey: "address.country",
			header: "Country",
			size: 150,
		},
		{
			accessorKey: "active_status",
			header: "Active",
			size: 100,
			Cell: ({ cell }) => <Checkbox checked={cell.getValue()} disabled />,
		},
	];

	const warehouseColumns = [
		{
			accessorKey: "warehouse_name",
			header: "Warehouse",
			size: 200,
		},
		{
			accessorKey: "address.street",
			header: "Street",
			size: 200,
		},
		{
			accessorKey: "address.city",
			header: "City",
			size: 150,
		},
		{
			accessorKey: "address.state",
			header: "State",
			size: 100,
		},
		{
			accessorKey: "address.zipcode",
			header: "Zipcode",
			size: 100,
		},
		{
			accessorKey: "address.country",
			header: "Country",
			size: 150,
		},
		{
			accessorKey: "same_as_site",
			header: "Same as Site",
			size: 120,
			Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
		},
		{
			accessorKey: "active_status",
			header: "Active",
			size: 100,
			Cell: ({ cell }) => <Checkbox checked={cell.getValue()} disabled />,
		},
	];

	const companyTable = createTableInstance(
		companyData,
		"Company",
		<BusinessIcon />,
		companyColumns,
		deleteCompany
	);
	const siteTable = createTableInstance(
		siteData,
		"Site",
		<LocationOnIcon />,
		siteColumns,
		deleteSite
	);
	const warehouseTable = createTableInstance(
		warehouseData,
		"Warehouse",
		<WarehouseIcon />,
		warehouseColumns,
		deleteWarehouse
	);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<MainCard
			title="Organization Details"
			caption="Comprehensive overview of your organization's structure and essential information"
		>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
				<Box>
					<Typography
						variant="h2"
						sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
					>
						<BusinessIcon /> Company Details
					</Typography>
					<MaterialReactTable table={companyTable} />
				</Box>
				<Divider />
				<Box>
					<Typography
						variant="h2"
						sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
					>
						<LocationOnIcon /> Site Details
					</Typography>
					<MaterialReactTable table={siteTable} />
				</Box>
				<Divider />
				<Box>
					<Typography
						variant="h2"
						sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
					>
						<WarehouseIcon /> Warehouse Details
					</Typography>
					<MaterialReactTable table={warehouseTable} />
				</Box>
			</Box>

			<EntryDialog
				open={dialogOpen}
				onClose={handleCloseDialog}
				title={
					currentType
						? currentType.charAt(0).toUpperCase() + currentType.slice(1)
						: ""
				}
				data={currentData}
				setData={setCurrentData}
				onSave={handleSaveDialog}
				fields={
					currentType === "company"
						? companyFields
						: currentType === "site"
							? siteFields
							: warehouseFields
				}
				isEditing={isEditing}
			/>
		</MainCard>
	);
};

export default OrgDetails;
