import React, { useState, useEffect, useCallback } from "react";
import {
	Box,
	Tabs,
	Tab,
	Typography,
	TextField,
	InputAdornment,
	Tooltip,
	IconButton,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	Button,
	Alert,
	Snackbar,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Download } from "@mui/icons-material";

import { Add } from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";
import CatalogIcon from "@mui/icons-material/Category";
import ContractIcon from "@mui/icons-material/Description";
import PurchaseOrderIcon from "@mui/icons-material/Receipt";
import FormsIcon from "@mui/icons-material/Assignment";
import axios from "axios";
import { MASTER_DATA } from "store/constant";

const SupplierTabs = ({ supplier, categoryName, parentCategoryName }) => {
	const [tabValue, setTabValue] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState({
		catalogs: [],
		contracts: [],
		purchaseOrders: [],
		forms: [],
	});

	const [tabsWithData, setTabsWithData] = useState([0, 1, 2, 3]);
	const [fetchedTabs, setFetchedTabs] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [newContract, setNewContract] = useState({
		supplier_name: supplier.name,
		supplier_id: supplier.id,
		contract_id: "",
		contract_value: 0,
		contract_utilised: 0,
		contract_term: 0,
		form_id: "",
		form_description: "",
		category: categoryName,
		parent_category: parentCategoryName,
		description: "",
		currency: "",
		contract_start_date: "",
		contract_end_date: "",
		file: null,
		avg_cost_per_hour: 0,
		hours_worked: 0,
		fixed_cost: 0,
	});
	const [editingContract, setEditingContract] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleTabChange = (event, newValue) => {
		if (tabsWithData.includes(newValue)) {
			setTabValue(newValue);
			fetchData(newValue);
		}
	};
	const filterData = useCallback(
		(dataArray) => {
			if (!searchTerm) return dataArray;
			return dataArray.filter((item) =>
				Object.values(item).some(
					(val) =>
						val &&
						val.toString().toLowerCase().includes(searchTerm.toLowerCase())
				)
			);
		},
		[searchTerm]
	);

	const handleAddContract = () => {
		setNewContract({
			...newContract,
			supplier_name: supplier.name,
			supplier_id: supplier.id,
			category: categoryName,
			parent_category: parentCategoryName,
		});
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setNewContract({
			supplier_name: "",
			avg_cost_per_hour: 0,
			hours_worked: 0,
			fixed_cost: 0,
			supplier_id: "",
			contract_id: "",
			contract_value: 0,
			contract_utilised: 0,
			contract_term: 0,
			form_id: "",
			form_description: "",
			category: "",
			parent_category: "",
			description: "",
			currency: "",
			contract_start_date: "",
			contract_end_date: "",
			file: null,
		});
	};
	const handleSaveContract = async () => {
		try {
			const formData = new FormData();

			// Create a contract object with all the fields except 'file'
			const contractData = Object.keys(newContract).reduce((acc, key) => {
				if (key !== "file") {
					acc[key] = newContract[key];
				}
				return acc;
			}, {});

			contractData.file = newContract.file !== null;

			formData.append("contract", JSON.stringify(contractData));

			if (newContract.file) {
				formData.append("file", newContract.file);
			}

			// Log the FormData contents
			// for (let [key, value] of formData.entries()) {
			// 	console.log(key, value);
			// }

			const temp = newContract.file;
			console.log(temp);

			const response = await axios.post(
				`${MASTER_DATA}/contracts/createContract`,
				formData,
				newContract.file,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			fetchData(1);
			handleCloseDialog();
		} catch (error) {
			console.error("Error saving contract:", error);
		}
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		setNewContract({ ...newContract, file: file });
	};

	const handleEditContract = (contract) => {
		setEditingContract(contract);
		setOpenEditDialog(true);
	};

	const handleCloseEditDialog = () => {
		setOpenEditDialog(false);
		setEditingContract(null);
	};

	const handleSaveEditedContract = async () => {
		try {
			const contractData = Object.keys(editingContract).reduce((acc, key) => {
				if (key !== "file") {
					acc[key] = editingContract[key];
				}
				return acc;
			}, {});

			contractData.file = editingContract.file !== null;

			// Ensure the updated_contract field is included
			contractData.updated_contract = editingContract; // or set it to the appropriate value

			const formData = new FormData();
			formData.append("contract", JSON.stringify(contractData));

			if (editingContract.file && editingContract.file instanceof File) {
				formData.append("file", editingContract.file);
			}

			console.log(
				"Sending data to server:",
				JSON.stringify(contractData, null, 2)
			);

			console.log(contractData);
			const response = await axios.put(
				`${MASTER_DATA}/contracts/updateContract/${editingContract.supplier_id}/${editingContract.contract_id}`,
				contractData
			);

			console.log("Server response:", response.data);

			// Update the local state with the edited contract
			setData((prevData) => ({
				...prevData,
				contracts: prevData.contracts.map((contract) =>
					contract.contract_id === editingContract.contract_id
						? response.data
						: contract
				),
			}));

			handleCloseEditDialog();
		} catch (error) {
			console.error("Error updating contract:", error);
			if (error.response) {
				console.error("Response data:", error.response.data);
				console.error("Response status:", error.response.status);
				console.error("Response headers:", error.response.headers);
				setErrorMessage(
					`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`
				);
			} else if (error.request) {
				console.error("No response received:", error.request);
			} else {
				console.error("Error setting up request:", error.message);
			}
		}
	};

	const handleDeleteContract = async (id) => {
		try {
			// First, update the local state
			setData((prevData) => ({
				...prevData,
				contracts: prevData.contracts.filter(
					(contract) => contract.contract_id !== id
				),
			}));

			// Then, call the API to delete the contract
			await axios.delete(`${MASTER_DATA}/contracts/deleteContract/${id}`);
		} catch (error) {
			console.error("Error deleting contract:", error);
			// Handle error (e.g., show error message to user and revert the local state change)
		}
	};

	const fetchData = async (tabIndex) => {
		if (fetchedTabs.includes(tabIndex)) {
			return; // Data already fetched for this tab, no need to fetch again
		}
		setLoading(true);
		setError(null);
		try {
			let endpoint;
			switch (tabIndex) {
				case 0:
					endpoint = `${MASTER_DATA}/catalogs/${categoryName}/supplierCatalogs/${supplier.id}`;
					break;
				case 1:
					endpoint = `${MASTER_DATA}/contracts/${categoryName}/supplierContracts/${supplier.id}`;
					break;
				case 2:
					endpoint = `${MASTER_DATA}/purchaseOrders/${categoryName}/supplierPOs/${supplier.id}`;
					break;
				case 3:
					endpoint = `${MASTER_DATA}/form/${categoryName}/supplierForms/${supplier.id}`;
					break;
				default:
					break;
			}
			const response = await axios.get(endpoint);
			const newData = { ...data };

			newData[Object.keys(data)[tabIndex]] = response.data;
			setData(newData);
			setFetchedTabs([...fetchedTabs, tabIndex]);

			// Update tabsWithData
			if (response.data.length === 0) {
				setTabsWithData((prevTabs) =>
					prevTabs.filter((tab) => tab !== tabIndex)
				);
			} else if (!tabsWithData.includes(tabIndex)) {
				setTabsWithData((prevTabs) => [...prevTabs, tabIndex]);
			}
		} catch (err) {
			// ... error handling ...
			// Assume no data for this tab on error
			setTabsWithData((prevTabs) => prevTabs.filter((tab) => tab !== tabIndex));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setFetchedTabs([]);
		setTabsWithData([0, 1, 2, 3]);
		fetchData(0);
	}, [categoryName, supplier.id]);

	const filterEmptyColumns = (columns, dataArray) => {
		return columns.filter((column) =>
			dataArray.some(
				(row) => row[column.field] != null && row[column.field] !== ""
			)
		);
	};

	const catalogColumns = [
		{ field: "catalog_id", headerName: "Catalog ID", width: 130 },
		{ field: "product_name", headerName: "Product Name", width: 200 },
		{ field: "product_id", headerName: "Product ID", width: 130 },
		{ field: "specification", headerName: "Specification", width: 200 },
		{
			field: "unit_price",
			headerName: "Unit Price",
			type: "number",
			width: 110,
		},
		{ field: "quantity", headerName: "Quantity", type: "number", width: 110 },
		{ field: "lead_time", headerName: "Lead Time", type: "number", width: 110 },
		{ field: "service_name", headerName: "Service Name", width: 130 },
		{ field: "description", headerName: "Description", width: 250 },
		{ field: "route", headerName: "Route", width: 130 },
		{ field: "equipment", headerName: "Equipment", width: 130 },
		{ field: "dimensions", headerName: "Dimensions", width: 130 },
		{ field: "distance_miles", headerName: "Distance (miles)", width: 190 },
		{ field: "base_rate_per_hour", headerName: "Base Rate/Hour", width: 130 },
		{ field: "fuel_surcharge", headerName: "Fuel Surcharge", width: 180 },
		{
			field: "detention_rate_per_hour",
			headerName: "Detention Rate/Hour",
			width: 200,
		},
		{
			field: "liftgate_service_rate",
			headerName: "Liftgate Service Rate",
			width: 200,
		},
		{ field: "currency", headerName: "Currency", width: 130 },
		{ field: "unit_of_measure", headerName: "Unit of Measure", width: 150 },
		{
			field: "special_instructions",
			headerName: "Special Instructions",
			width: 190,
		},
		{
			field: "additional_terms_and_conditions",
			headerName: "Additional Terms and Conditions",
			width: 300,
		},
		{
			field: "additional_services",
			headerName: "Additional Services",
			width: 250,
		},
	];

	const contractColumns = [
		{ field: "contract_id", headerName: "Contract ID", width: 130 },
		{ field: "description", headerName: "Description", width: 300 },
		{
			field: "contract_start_date",
			headerName: "Start Date",
			width: 130,
			renderCell: (params) => {
				const date = params.value ? params.value.substring(0, 10) : "";
				if (date) {
					const [year, month, day] = date.split("-");
					return `${month}/${day}/${year}`;
				}
				return "";
			},
		},
		{
			field: "contract_end_date",
			headerName: "End Date",
			width: 130,
			renderCell: (params) => {
				const date = params.value ? params.value.substring(0, 10) : "";
				if (date) {
					const [year, month, day] = date.split("-");
					return `${month}/${day}/${year}`;
				}
				return "";
			},
		},
		{ field: "contract_term", headerName: "Term", type: "number", width: 100 },
		{
			field: "contract_value",
			headerName: "Value",
			type: "number",
			width: 130,
			renderCell: (params) => {
				const value = params.value
					? params.value.toString().replace(/,/g, "")
					: "";
				if (value) {
					return new Intl.NumberFormat("en-US").format(value);
				}
				return "";
			},
		},
		{
			field: "contract_utilised",
			headerName: "Utilised",
			type: "number",
			width: 130,
		},
		{
			field: "avg_cost_per_hour",
			headerName: "Avg Cost/Hour",
			type: "number",
			width: 130,
		},
		{
			field: "hours_worked",
			headerName: "Hours Worked",
			type: "number",
			width: 130,
		},
		{
			field: "fixed_cost",
			headerName: "Fixed Cost",
			type: "number",
			width: 130,
		},
		{ field: "currency", headerName: "Currency", width: 110 },
		{ field: "form_id", headerName: "Form ID", width: 130 },
		{ field: "form_description", headerName: "Form Description", width: 300 },
		{
			field: "file",
			headerName: "Signed Contract",
			width: 150,
			renderCell: (params) =>
				params.value ? (
					<Button
						variant="contained"
						color="primary"
						startIcon={<Download />}
						onClick={() => {
							handleDownload(params.row);
						}}
					>
						Download
					</Button>
				) : (
					"No file"
				),
		},

		{
			field: "base_rate_per_mile",
			headerName: "Base Rate/Mile",
			type: "number",
			align: "left",
			headerAlign: "left",
			width: 190,
		},
		{
			field: "unit_of_measure",
			headerName: "Unit of Measure",
			width: 150,
		},
		{
			field: "service_name",
			headerName: "Service Name",
			width: 130,
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			renderCell: (params) => (
				<>
					<IconButton onClick={() => handleEditContract(params.row)}>
						<EditIcon />
					</IconButton>
					<IconButton
						onClick={() => handleDeleteContract(params.row.contract_id)}
					>
						<DeleteIcon />
					</IconButton>
				</>
			),
		},
	];

	const handleDownload = async (row) => {
		try {
			const response = await axios.get(
				`${MASTER_DATA}/contracts/downloadContractFile/${row.supplier_id}/${row.contract_id}`,
				{
					responseType: "blob",
				}
			);

			const contentType = response.headers["content-type"];

			const blob = new Blob([response.data], { type: contentType });

			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;

			const fileName = `contract_${row.contract_id}.pdf`;
			link.setAttribute("download", fileName);

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	const poColumns = [
		{ field: "po_number", headerName: "PO Number", width: 130 },
		{ field: "product_name", headerName: "Product Name", width: 200 },
		{ field: "product_id", headerName: "Product ID", width: 130 },
		{ field: "description", headerName: "Description", width: 200 },
		{ field: "specification", headerName: "Specification", width: 200 },
		{ field: "contract_id", headerName: "Contract ID", width: 130 },
		{ field: "catalog_id", headerName: "Catalog ID", width: 130 },
		{ field: "service_name", headerName: "Service Name", width: 130 },
		{
			field: "unit_price",
			headerName: "Unit Price",
			type: "number",
			width: 110,
		},
		{
			field: "quantity",
			headerName: "Quantity",
			type: "number",
			width: 110,
			headerAlign: "left",
			align: "left",
		},
		{ field: "unit_of_measure", headerName: "Unit of Measure", width: 150 },
		{
			field: "dimensions",
			headerName: "Dimensions",
			width: 190,
		},
		{
			field: "total_weight_lbs",
			headerName: "Total Weight (lbs)",
			type: "number",
			headerAlign: "left",
			align: "left",
			width: 190,
		},
		{
			field: "invoice_amount",
			headerName: "Invoice Amount",
			type: "number",
			width: 130,
		},
		{
			field: "distance_miles",
			headerName: "Distance (miles)",
			width: 190,
		},
		{
			field: "base_rate_per_mile",
			headerName: "Base Rate/Mile",
			type: "number",
			headerAlign: "left",
			align: "left",
			width: 190,
		},
		{
			field: "fuel_surcharge",
			headerName: "Fuel Surcharge",
			type: "number",
			headerAlign: "left",
			align: "left",
			width: 190,
		},
		{
			field: "liftgate_service_rate",
			headerName: "Liftgate Service Rate",
			headerAlign: "left",
			align: "left",
			type: "number",
			width: 190,
		},
		{
			field: "po_amount",
			headerName: "PO Amount",
			type: "number",
			width: 130,
			headerAlign: "left",
			align: "left",
		},
		{ field: "currency", headerName: "Currency", width: 110 },
		{
			field: "po_date",
			headerName: "PO Date",
			width: 130,
			headerAlign: "left",
			align: "left",
			renderCell: (params) => {
				const date = params.value ? params.value.substring(0, 10) : "";
				if (date) {
					const [year, month, day] = date.split("-");
					return `${month}/${day}/${year}`;
				}
				return "";
			},
		},
		{ field: "invoice_date", headerName: "Invoice Date", width: 130 },
		{
			field: "delivery_date",
			headerName: "Delivery Date",
			width: 130,
			renderCell: (params) => {
				const date = params.value ? params.value.substring(0, 10) : "";
				if (date) {
					const [year, month, day] = date.split("-");
					return `${month}/${day}/${year}`;
				}
				return "";
			},
		},
		{
			field: "actual_receipt_date",
			headerName: "Actual Receipt Date",
			width: 150,
		},
		{ field: "department", headerName: "Department", width: 130 },
		{ field: "cost_center", headerName: "Cost Center", width: 130 },
		{ field: "gl_account_id", headerName: "GL Account ID", width: 130 },
		{ field: "requester", headerName: "Requester", width: 130 },
		{
			field: "quality_check",
			headerName: "Quality Check",
			type: "boolean",
			width: 130,
		},
		{
			field: "route",
			headerName: "Route",
			width: 130,
		},
		{
			field: "equipment",
			headerName: "Equipment",
			width: 130,
		},
	];

	const formColumns = [
		{ field: "form_id", headerName: "Form ID", width: 130 },
		{ field: "form_description", headerName: "Form Description", width: 300 },
		{ field: "country", headerName: "Country", width: 130 },
	];

	const renderDataGrid = (dataArray, columns) => {
		if (dataArray.length === 0) return null;

		const filteredColumns = filterEmptyColumns(columns, dataArray);

		return (
			<div style={{ height: 400, width: "100%" }}>
				<DataGrid
					rows={filterData(dataArray)}
					columns={filteredColumns}
					pageSize={5}
					rowsPerPageOptions={[5, 10, 20]}
					checkboxSelection
					disableSelectionOnClick
					getRowId={(row) =>
						`${row.catalog_id || ""}-${row.contract_id || ""}-${row.po_number || ""}-${row.form_id || ""}`
					}
					sx={{
						height: 500,
						"& .MuiDataGrid-row.Mui-selected": {
							backgroundColor: "#fff",
							"&:hover": {
								backgroundColor: "#fff",
							},
						},
						"& .MuiDataGrid-columnHeaderTitle": {
							fontWeight: "600",
							fontSize: "1rem",
						},
						"& .MuiDataGrid-cell:focus": {
							outline: "none",
						},
						"& .MuiLinearProgress-bar": {
							backgroundColor: "#9747FF",
						},
						"& .MuiLinearProgress-root": {
							backgroundColor: "#E8DEF8",
						},
					}}
				/>
			</div>
		);
	};

	const allTabsEmpty =
		data.catalogs.length === 0 &&
		data.contracts.length === 0 &&
		data.purchaseOrders.length === 0 &&
		data.forms.length === 0;

	return (
		<>
			<Box
				sx={{
					borderBottom: 0,
					borderColor: "divider",
					mt: 2,
					color: "#5e17eb",
				}}
			>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					TabIndicatorProps={{ style: { backgroundColor: "#5e17eb" } }}
					sx={{
						"& .MuiTab-root": {
							color: "text.secondary",
							"&.Mui-selected": { color: "#5e17eb" },
						},
					}}
				>
					<Tab
						icon={<CatalogIcon />}
						label="Catalog"
						disabled={!tabsWithData.includes(0)}
					/>
					<Tab
						icon={<ContractIcon />}
						label="Contract"
						disabled={!tabsWithData.includes(1)}
					/>
					<Tab
						icon={<PurchaseOrderIcon />}
						label="PO"
						disabled={!tabsWithData.includes(2)}
					/>
					<Tab
						icon={<FormsIcon />}
						label="Forms"
						disabled={!tabsWithData.includes(3)}
					/>
				</Tabs>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
					mt: 2,
				}}
			>
				<TextField
					size="small"
					variant="outlined"
					placeholder="Search..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon fontSize="small" />
							</InputAdornment>
						),
					}}
					sx={{
						width: "200px",
						backgroundColor: "white",
						"& .MuiOutlinedInput-root": {
							borderRadius: "4px",
							"& fieldset": {
								borderColor: "#5e17eb",
							},
							"&:hover fieldset": {
								borderColor: "#5e17eb",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#5e17eb",
							},
						},
					}}
				/>
				<Box>
					{tabValue === 1 && (
						<>
							<Tooltip title="Add Row" placement="top">
								<IconButton
									aria-label="add row"
									component="label"
									onClick={handleAddContract}
									sx={{
										color: "#5e17eb",
										"&:hover": {
											color: "#5a5ad1",
										},
									}}
								>
									<Add />
								</IconButton>
							</Tooltip>
						</>
					)}
					<Tooltip title="Upload CSV" placement="top">
						<IconButton
							aria-label="upload csv"
							component="label"
							sx={{
								color: "#5e17eb",
								"&:hover": {
									color: "#5a5ad1",
								},
							}}
						>
							<input hidden accept=".csv" type="file" />
							<UploadFileIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
			{loading ? (
				<CircularProgress />
			) : error ? (
				<Typography color="error">{error}</Typography>
			) : (
				<>
					{tabValue === 0 && renderDataGrid(data.catalogs, catalogColumns)}
					{tabValue === 1 && (
						<>
							<DataGrid
								rows={filterData(data.contracts)}
								columns={contractColumns}
								pageSize={5}
								rowsPerPageOptions={[5, 10, 20]}
								checkboxSelection
								disableSelectionOnClick
								getRowId={(row) => `${row.contract_id || ""}}`}
								sx={{
									height: 500,
									"& .MuiDataGrid-row.Mui-selected": {
										backgroundColor: "#fff",
										"&:hover": {
											backgroundColor: "#fff",
										},
									},
									"& .MuiDataGrid-columnHeaderTitle": {
										fontWeight: "600",
										fontSize: "1rem",
									},
									"& .MuiDataGrid-cell:focus": {
										outline: "none",
									},
									"& .MuiLinearProgress-bar": {
										backgroundColor: "#9747FF",
									},
									"& .MuiLinearProgress-root": {
										backgroundColor: "#E8DEF8",
									},
								}}
							/>
							<Dialog open={openDialog} onClose={handleCloseDialog}>
								<DialogTitle>Add New Contract</DialogTitle>
								<DialogContent>
									{Object.keys(newContract).map((key) => {
										if (key === "file") return null;

										const isFixedField = [
											"supplier_name",
											"supplier_id",
											"category",
											"parent_category",
										].includes(key);

										return (
											<TextField
												key={key}
												label={key
													.replace(/_/g, " ")
													.replace(/\b\w/g, (l) => l.toUpperCase())}
												value={newContract[key]}
												onChange={(e) =>
													setNewContract({
														...newContract,
														[key]: e.target.value,
													})
												}
												fullWidth
												margin="normal"
												type={
													key.includes("date")
														? "date"
														: typeof newContract[key] === "number"
															? "number"
															: "text"
												}
												InputProps={{
													readOnly: isFixedField,
												}}
												disabled={isFixedField}
											/>
										);
									})}
									<input
										accept="*/*"
										style={{ display: "none" }}
										id="raised-button-file"
										type="file"
										onChange={handleFileUpload}
									/>
									<label htmlFor="raised-button-file">
										<Button variant="raised" component="span">
											Upload File
										</Button>
									</label>
									{newContract.file && (
										<Typography>{newContract.file.name}</Typography>
									)}
								</DialogContent>
								<DialogActions>
									<Button onClick={handleCloseDialog}>Cancel</Button>
									<Button onClick={handleSaveContract} color="primary">
										Save
									</Button>
								</DialogActions>
							</Dialog>
							<Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
								<DialogTitle>Edit Contract</DialogTitle>
								<DialogContent>
									{editingContract &&
										Object.keys(editingContract).map((key) => {
											if (key === "file") return null;

											const isFixedField = [
												"supplier_name",
												"supplier_id",
												"category",
												"parent_category",
											].includes(key);

											return (
												<TextField
													key={key}
													label={key
														.replace(/_/g, " ")
														.replace(/\b\w/g, (l) => l.toUpperCase())}
													value={editingContract[key]}
													onChange={(e) =>
														setEditingContract({
															...editingContract,
															[key]: e.target.value,
														})
													}
													fullWidth
													margin="normal"
													type={
														key.includes("date")
															? "date"
															: typeof editingContract[key] === "number"
																? "number"
																: "text"
													}
													InputProps={{
														readOnly: isFixedField,
													}}
													disabled={isFixedField}
												/>
											);
										})}
									<input
										accept="*/*"
										style={{ display: "none" }}
										id="edit-raised-button-file"
										type="file"
										onChange={(e) =>
											setEditingContract({
												...editingContract,
												file: e.target.files[0],
											})
										}
									/>
									<label htmlFor="edit-raised-button-file">
										<Button variant="raised" component="span">
											Upload File
										</Button>
									</label>
									{editingContract && editingContract.file && (
										<Typography>
											{editingContract.file.name || "Current file"}
										</Typography>
									)}
								</DialogContent>
								<DialogActions>
									<Button onClick={handleCloseEditDialog}>Cancel</Button>
									<Button onClick={handleSaveEditedContract} color="primary">
										Save
									</Button>
								</DialogActions>
							</Dialog>
							<Snackbar
								open={!!errorMessage}
								autoHideDuration={6000}
								onClose={() => setErrorMessage("")}
							>
								<Alert
									onClose={() => setErrorMessage("")}
									severity="error"
									sx={{ width: "100%" }}
								>
									{errorMessage}
								</Alert>
							</Snackbar>
						</>
					)}
					{tabValue === 2 && renderDataGrid(data.purchaseOrders, poColumns)}
					{tabValue === 3 && renderDataGrid(data.forms, formColumns)}
					{data.catalogs.length === 0 &&
						data.contracts.length === 0 &&
						data.purchaseOrders.length === 0 &&
						data.forms.length === 0 && (
							<Typography variant="body1" sx={{ mt: 2 }}>
								No data available for this supplier in any category.
							</Typography>
						)}
				</>
			)}
		</>
	);
};
export default SupplierTabs;
