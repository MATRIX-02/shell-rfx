import React, { useEffect, useMemo, useState } from "react";
import {
	MaterialReactTable,
	useMaterialReactTable,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFullScreenButton,
	MRT_ShowHideColumnsButton,
	MRT_ToggleFiltersButton,
} from "material-react-table";
import { Box, IconButton, Tooltip, MenuItem, Button } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import useContracts from "hooks/MasterData/useContracts";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Add as AddIcon, Delete, Edit as EditIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";
import FileUploadDialog from "./FileUploadDialog";
import ContractDialog from "./ContractDialog";
import axios from "axios";
import { MASTER_DATA } from "store/constant";
import {
	IconTableImport,
	IconTableExport,
	IconDownload,
	IconDownloadOff,
} from "@tabler/icons-react";

const Contracts = () => {
	const {
		loading,
		error,
		getAllContracts,
		deleteContract,
		createContract,
		updateContract,
	} = useContracts();
	const [contracts, setContracts] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentContract, setCurrentContract] = useState({});
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		fetchContracts();
	}, []);

	const fetchContracts = async () => {
		try {
			const response = await getAllContracts();
			setContracts(response.data);
		} catch (err) {
			console.error("Fetch error:", err);
			dispatch(
				showSnackbar({
					message: `Failed to fetch contracts!`,
					severity: "error",
				})
			);
		}
	};

	const handleCreateNewContract = async (contractData, file) => {
		try {
			await createContract(contractData, file);
			fetchContracts();
			dispatch(
				showSnackbar({
					message: `Contract created successfully!`,
					severity: "success",
				})
			);
			setDialogOpen(false);
		} catch (err) {
			console.error("Create error:", err);
			dispatch(
				showSnackbar({
					message: `Error creating contract!`,
					severity: "error",
				})
			);
		}
	};

	const handleUpdateContract = async (contractData, file) => {
		try {
			await updateContract(
				contractData.supplier_id,
				contractData.contract_id,
				contractData,
				file
			);
			fetchContracts();
			dispatch(
				showSnackbar({
					message: `Contract updated successfully!`,
					severity: "success",
				})
			);
			setDialogOpen(false);
		} catch (err) {
			console.error("Update error:", err);
			dispatch(
				showSnackbar({
					message: `Failed to update contract!`,
					severity: "error",
				})
			);
		}
	};

	const handleDeleteContract = async (contractId) => {
		if (window.confirm("Are you sure you want to delete this contract?")) {
			try {
				await deleteContract(contractId);
				dispatch(
					showSnackbar({
						message: `Contract deleted successfully!`,
						severity: "success",
					})
				);
				fetchContracts();
			} catch (err) {
				console.error("Delete error:", err);
				dispatch(
					showSnackbar({
						message: `Failed to delete contract!`,
						severity: "error",
					})
				);
			}
		}
	};

	const handleEdit = (row) => {
		setCurrentContract(row.original);
		setIsEditing(true);
		setDialogOpen(true);
	};

	const handleAdd = () => {
		setCurrentContract({});
		setIsEditing(false);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setCurrentContract({});
		setIsEditing(false);
	};

	const handleFileUploadClick = () => {
		setUploadDialogOpen(true);
	};

	const handleFileUpload = (files) => {
		console.log("Uploaded files:", files);
		setUploadDialogOpen(false);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "category",
				header: "Category",
				size: 150,
			},
			{
				accessorKey: "parent_category",
				header: "Parent Category",
				size: 170,
			},
			{
				accessorKey: "supplier_name",
				header: "Supplier Name",
				size: 190,
			},
			{
				accessorKey: "fixed_cost",
				header: "Fixed Cost",
				size: 190,
			},
			{
				accessorKey: "supplier_id",
				header: "Supplier ID",
				size: 150,
			},
			{
				accessorKey: "contract_id",
				header: "Contract ID",
				size: 150,
			},
			{
				accessorKey: "contract_value",
				header: "Contract Value",
				size: 150,
			},
			{
				accessorKey: "contract_utilised",
				header: "Contract Utilised",
				size: 150,
			},
			{
				accessorKey: "contract_term",
				header: "Contract Term",
				size: 150,
			},
			{
				accessorKey: "form_id",
				header: "Form ID",
				size: 150,
			},
			{
				accessorKey: "form_description",
				header: "Form Description",
				size: 410,
			},
			{
				accessorKey: "description",
				header: "Description",
				size: 410,
			},
			{
				accessorKey: "currency",
				header: "Currency",
				size: 150,
			},
			{
				accessorKey: "contract_start_date",
				header: "Start Date",
				size: 150,
				Cell: ({ cell }) => {
					const value = cell.getValue();
					if (!value) return null;
					return new Date(value).toLocaleDateString();
				},
			},
			{
				accessorKey: "contract_end_date",
				header: "End Date",
				size: 150,
				Cell: ({ cell }) => {
					const value = cell.getValue();
					if (!value) return null;
					return new Date(value).toLocaleDateString();
				},
			},
			{
				accessorKey: "avg_cost_per_hour",
				header: "Avg Cost Per Hour",
				size: 150,
			},
			{
				accessorKey: "hours_worked",
				header: "Hours Worked",
				size: 150,
			},
			{
				accessorKey: "base_rate_per_mile",
				header: "Base Rate Per Mile",
				size: 150,
			},
			{
				accessorKey: "unit_of_measure",
				header: "Unit of Measure",
				size: 150,
			},
			{
				accessorKey: "service_name",
				header: "Service Name",
				size: 150,
			},
			{
				accessorKey: "file",
				header: "Signed Contract",
				size: 150,
				Cell: ({ row }) => {
					const file = row.original.file;
					const supplierId = row.original.supplier_id;
					const contractId = row.original.contract_id;

					const handleDownload = async () => {
						try {
							const response = await axios.get(
								`${MASTER_DATA}/contracts/downloadContractFile/${supplierId}/${contractId}`,
								{
									responseType: "blob",
								}
							);
							const contentType = response.headers["content-type"];
							const blob = new Blob([response.data], { type: contentType });
							const url = window.URL.createObjectURL(blob);
							const link = document.createElement("a");
							link.href = url;
							const fileName = `contract_${contractId}.pdf`;
							link.setAttribute("download", fileName);
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
							window.URL.revokeObjectURL(url);
						} catch (error) {
							console.error("Error downloading the file", error);
						}
					};

					return file ? (
						<Box sx={{ display: "flex", justifyContent: "center" }}>
							<IconButton onClick={handleDownload}>
								<IconDownload color="#00c129" />
							</IconButton>
						</Box>
					) : (
						<Box sx={{ display: "flex", justifyContent: "center" }}>
							<IconDownloadOff color="#d3d3d3" />
						</Box>
					);
				},
			},
		],
		[]
	);

	const csvConfig = mkConfig({
		fieldSeparator: ",",
		decimalSeparator: ".",
		useKeysAsHeaders: true,
	});

	const handleExportRows = (rows) => {
		const rowData = rows.map((row) => row.original);
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	};

	const table = useMaterialReactTable({
		columns,
		data: contracts,
		enableColumnOrdering: true,
		enableBottomToolbar: true,
		positionActionsColumn: "last",
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
			placeholder: `Search contracts`,
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
		renderToolbarInternalActions: ({ table }) => (
			<Box>
				<Tooltip title="Create New Contract">
					<IconButton onClick={handleAdd}>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Export All Rows">
					<IconButton
						onClick={() =>
							handleExportRows(table.getPrePaginationRowModel().rows)
						}
					>
						<IconTableExport />
					</IconButton>
				</Tooltip>
				<Tooltip title="Import CSV">
					<IconButton onClick={handleFileUploadClick}>
						<IconTableImport />
					</IconButton>
				</Tooltip>
				<MRT_ToggleFiltersButton table={table} />
				<MRT_ShowHideColumnsButton table={table} />
				<MRT_ToggleDensePaddingButton table={table} />
				<MRT_ToggleFullScreenButton table={table} />
			</Box>
		),
		state: {
			isLoading: loading,
			showAlertBanner: error,
			showProgressBars: loading,
		},
		enableStickyHeader: true,
		enableRowActions: true,
		renderRowActionMenuItems: ({ row }) => [
			<MenuItem key="edit" onClick={() => handleEdit(row)}>
				<EditIcon />
				Edit
			</MenuItem>,
			<MenuItem
				key="delete"
				onClick={() => handleDeleteContract(row.original.contract_id)}
			>
				<Delete />
				Delete
			</MenuItem>,
		],
		muiTableHeadCellProps: {
			sx: {
				backgroundColor: "#f9f9f9",
				fontWeight: "400",
				color: "#000",
				fontSize: "1rem",
			},
		},
		muiTablePaperProps: {
			sx: {
				boxShadow: "none",
				position: "relative",
			},
		},
		muiTableContainerProps: {
			sx: {
				maxHeight: 600,
				minHeight: 600,
				border: "1px solid #ddd",
			},
		},
	});

	return (
		<MainCard
			title="Contracts"
			caption="Manage contract details, terms, and key dates to ensure compliance and clarity"
		>
			<MaterialReactTable table={table} />
			<ContractDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				onSave={isEditing ? handleUpdateContract : handleCreateNewContract}
				contract={currentContract}
				isEditing={isEditing}
			/>
			<FileUploadDialog
				open={uploadDialogOpen}
				onClose={() => setUploadDialogOpen(false)}
				onUpload={handleFileUpload}
			/>
		</MainCard>
	);
};

export default Contracts;
