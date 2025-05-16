import React, { useEffect, useMemo, useState } from "react";
import {
	MaterialReactTable,
	useMaterialReactTable,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFullScreenButton,
	MRT_ShowHideColumnsButton,
	MRT_ToggleFiltersButton,
} from "material-react-table";
import {
	Box,
	IconButton,
	Tooltip,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormControl,
	TextField,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { Add as AddIcon, Delete, Edit } from "@mui/icons-material";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";

import axios from "axios";
import { MASTER_DATA } from "store/constant";
import { mkConfig, generateCsv, download } from "export-to-csv";
import FileUploadDialog from "./FileUploadDialog";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";
import ESCustomTextField from "ui-component/ESCustomTextField";

const GLAccount = () => {
	const [glAccounts, setGLAccounts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editedRow, setEditedRow] = useState(null);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [newRow, setNewRow] = useState({
		gl_account_id: "",
		gl_account_name: "",
		category_name: "",
		company: "",
		account_type: "",
		currency: "",
		erp_system: "",
		active: true,
		creation_date: new Date().toISOString(),
		created_by: "",
		last_modified_date: new Date().toISOString(),
		last_modified_by: "",
	});

	const dispatch = useDispatch();

	// CSV Export Configuration
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

	const handleFileUploadClick = () => {
		setUploadDialogOpen(true);
	};

	const handleFileUpload = (files) => {
		console.log("Uploaded files:", files);
		setUploadDialogOpen(false);
		// Implement your file upload logic here
		// You may want to parse the CSV and update the GL Accounts
	};

	useEffect(() => {
		fetchGLAccounts();
	}, []);

	const fetchGLAccounts = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${MASTER_DATA}/glAccount/getAllGlAccounts`
			);
			setGLAccounts(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching GL Accounts:", err);
			setError("Failed to fetch GL Accounts");
			dispatch(
				showSnackbar({
					message: `Failed to fetch GL Account!`,
					severity: "error",
				})
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateNewGLAccount = async () => {
		try {
			const response = await axios.post(
				`${MASTER_DATA}/glAccount/createGlAccount`,
				newRow
			);
			dispatch(
				showSnackbar({
					message: `GL Account created successfully!`,
					severity: "success",
				})
			);
			setGLAccounts([newRow, ...glAccounts]);
			handleCloseAddDialog();
			fetchGLAccounts();
		} catch (err) {
			console.error("Error adding GL Account:", err);
			dispatch(
				showSnackbar({
					message: `Failed to create GL Account!`,
					severity: "error",
				})
			);
		}
	};

	const handleDeleteGLAccount = async (row) => {
		try {
			await axios.delete(
				`${MASTER_DATA}/glAccount/deleteGlAccount/${row.gl_account_id}`
			);
			setGLAccounts((prevRows) => prevRows.filter((r) => r.id !== row.id));
			dispatch(
				showSnackbar({
					message: `GL Account deleted successfully!`,
					severity: "success",
				})
			);
			fetchGLAccounts();
		} catch (error) {
			console.error("Error deleting row:", error);
			dispatch(
				showSnackbar({
					message: `Failed to delete GL Account!`,
					severity: "error",
				})
			);
		}
	};

	const handleEditGLAccount = (row) => {
		setEditedRow(row);
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = () => {
		setOpenEditDialog(false);
		setEditedRow(null);
	};

	const handleEditedRowChange = (event) => {
		const { name, value, type, checked } = event.target;
		setEditedRow((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSaveEditedRow = async () => {
		try {
			const response = await axios.put(
				`${MASTER_DATA}/glAccount/updateGlAccount/${editedRow.gl_account_id}`,
				editedRow
			);
			console.log("Row updated:", response.data);
			setGLAccounts((prevRows) =>
				prevRows.map((row) => (row.id === editedRow.id ? editedRow : row))
			);
			handleCloseEditDialog();
			dispatch(
				showSnackbar({
					message: `GL Account updated successfully!`,
					severity: "success",
				})
			);
			fetchGLAccounts();
		} catch (error) {
			console.error("Error updating row:", error);
			dispatch(
				showSnackbar({
					message: `Failed to update GL Account!`,
					severity: "error",
				})
			);
		}
	};

	const handleBulkUpload = (event) => {
		const file = event.target.files[0];
		console.log("File uploaded:", file.name);
		// Implement bulk upload logic here
	};

	const handleOpenAddDialog = () => {
		setOpenAddDialog(true);
	};

	const handleCloseAddDialog = () => {
		setOpenAddDialog(false);
		setNewRow({
			gl_account_id: "",
			gl_account_name: "",
			category_name: "",
			company: "",
			account_type: "",
			currency: "",
			erp_system: "",
			active: true,
			creation_date: new Date().toISOString(),
			created_by: "",
			last_modified_date: new Date().toISOString(),
			last_modified_by: "",
		});
	};

	const handleNewRowChange = (event) => {
		const { name, value, type, checked } = event.target;
		setNewRow((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "gl_account_id",
				header: "GL Account ID",
				size: 150,
			},
			{
				accessorKey: "gl_account_name",
				header: "GL Account Name",
				size: 200,
			},
			{
				accessorKey: "category_name",
				header: "Category Name",
				size: 150,
			},
			{
				accessorKey: "company",
				header: "Company",
				size: 150,
			},
			{
				accessorKey: "account_type",
				header: "Account Type",
				size: 150,
			},
			{
				accessorKey: "currency",
				header: "Currency",
				size: 100,
			},
			{
				accessorKey: "erp_system",
				header: "ERP System",
				size: 150,
			},
			{
				accessorKey: "active",
				header: "Active",
				size: 100,
				Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
			},
		],
		[]
	);

	const table = useMaterialReactTable({
		columns,
		data: glAccounts,
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
			placeholder: `Search GL Accounts`,
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
				<Tooltip title="Create New GL Account">
					<IconButton onClick={handleOpenAddDialog}>
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
				<Tooltip title="Upload CSV">
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
			showLoadingOverlay: false,
		},
		enableStickyHeader: true,
		enableRowActions: true,
		renderRowActionMenuItems: ({ row }) => [
			<MenuItem key="edit" onClick={() => handleEditGLAccount(row.original)}>
				<Edit />
				Edit
			</MenuItem>,
			<MenuItem
				key="delete"
				onClick={() => handleDeleteGLAccount(row.original)}
			>
				<Delete />
				Delete
			</MenuItem>,
		],
		mrtTheme: (theme) => ({
			matchHighlightColor: "#FF9632",
		}),
		muiTableBodyRowProps: ({ row }) => ({
			sx: {
				backgroundColor: row.original?._creating
					? "rgba(25, 118, 210, 0.05)"
					: undefined,
			},
		}),
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
			title="GL Account"
			caption="Maintain an overview of general ledger accounts for accurate financial reporting"
		>
			<MaterialReactTable table={table} />

			<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
				<DialogTitle>Add New GL Account</DialogTitle>
				<DialogContent style={{ paddingTop: "20px" }}>
					{Object.keys(newRow).map((key) => (
						<FormControl fullWidth key={key} style={{ marginBottom: "16px" }}>
							{key === "active" ? (
								<FormControlLabel
									control={
										<Checkbox
											checked={newRow[key]}
											onChange={handleNewRowChange}
											name={key}
										/>
									}
									label={key
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
								/>
							) : (
								<TextField
									name={key}
									label={key
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}
									value={newRow[key]}
									onChange={handleNewRowChange}
									type={key.includes("date") ? "datetime-local" : "text"}
									InputLabelProps={{ shrink: true }}
									fullWidth
									variant="outlined"
								/>
							)}
						</FormControl>
					))}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseAddDialog}>Cancel</Button>
					<Button
						onClick={handleCreateNewGLAccount}
						variant="contained"
						color="primary"
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
				<DialogTitle bgcolor="secondary.dark" color="white" variant="h3">
					Edit GL Account
				</DialogTitle>
				<DialogContent style={{ paddingTop: "20px" }}>
					{editedRow &&
						Object.keys(editedRow).map((key) => (
							<FormControl fullWidth key={key} style={{ marginBottom: "16px" }}>
								{key === "active" ? (
									<FormControlLabel
										control={
											<Checkbox
												checked={editedRow[key]}
												onChange={handleEditedRowChange}
												name={key}
											/>
										}
										label={key
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
									/>
								) : (
									<ESCustomTextField
										name={key}
										label={key
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1)
											)
											.join(" ")}
										value={editedRow[key]}
										onChange={handleEditedRowChange}
										type={key.includes("date") ? "datetime-local" : "text"}
										InputLabelProps={{ shrink: true }}
										fullWidth
										variant="outlined"
										disabled={key === "id" || key === "gl_account_id"}
									/>
								)}
							</FormControl>
						))}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseEditDialog}>Cancel</Button>
					<Button
						onClick={handleSaveEditedRow}
						variant="contained"
						color="primary"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
			<FileUploadDialog
				open={uploadDialogOpen}
				onClose={() => setUploadDialogOpen(false)}
				onUpload={handleFileUpload}
			/>
		</MainCard>
	);
};

export default GLAccount;
