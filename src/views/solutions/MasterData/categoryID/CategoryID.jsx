import React, { useEffect, useMemo, useState } from "react";
import {
	MaterialReactTable,
	useMaterialReactTable,
	MRT_ActionMenuItem,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFullScreenButton,
	MRT_ShowHideColumnsButton,
	MRT_ToggleFiltersButton,
} from "material-react-table";
import {
	Box,
	IconButton,
	Tooltip,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
	Typography,
	Divider,
} from "@mui/material";
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Edit,
} from "@mui/icons-material";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import MainCard from "ui-component/cards/MainCard";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";
import axios from "axios";
import { MASTER_DATA } from "store/constant";
import CategoryDialog from "./CategoryDialog";
import FileUploadDialog from "./FileUploadDialog";

// Main CategoryID component
const CategoryID = () => {
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [currentCategory, setCurrentCategory] = useState({
		parent_category_id: "",
		parent_category: "",
		parent_category_description: "",
		category_level: "",
		unspsc_code: "",
		categories: [],
	});
	const [isEditing, setIsEditing] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				`${MASTER_DATA}/categoryId/allCategoryIds`
			);
			setCategories(response.data);
		} catch (error) {
			dispatch(
				showSnackbar({
					message: "Failed to fetch categories",
					severity: "error",
				})
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSaveCategory = async () => {
		try {
			if (isEditing) {
				await axios.put(
					`${MASTER_DATA}/categoryId/updateCategory/${currentCategory.parent_category_id}`,
					currentCategory
				);
				setCategories((prevCategories) =>
					prevCategories.map((cat) =>
						cat.parent_category_id === currentCategory.parent_category_id
							? currentCategory
							: cat
					)
				);
			} else {
				const response = await axios.post(
					`${MASTER_DATA}/categoryId/insertSingleCategory`,
					currentCategory
				);
				setCategories((prevCategories) => [...prevCategories, response.data]);
			}
			setIsDialogOpen(false);
			dispatch(
				showSnackbar({
					message: `Category ${isEditing ? "updated" : "created"} successfully`,
					severity: "success",
				})
			);
		} catch (error) {
			dispatch(
				showSnackbar({
					message: `Failed to ${isEditing ? "update" : "create"} category`,
					severity: "error",
				})
			);
		}
	};

	const handleDeleteCategory = async (categoryId) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			try {
				await axios.delete(
					`${MASTER_DATA}/categoryId/deleteCategory/${categoryId}`
				);
				setCategories((prevCategories) =>
					prevCategories.filter((cat) => cat.parent_category_id !== categoryId)
				);
				dispatch(
					showSnackbar({
						message: "Category deleted successfully",
						severity: "success",
					})
				);
			} catch (error) {
				dispatch(
					showSnackbar({
						message: "Failed to delete category",
						severity: "error",
					})
				);
			}
		}
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: "parent_category_id",
				header: "Category ID",
				size: 150,
			},
			{
				accessorKey: "parent_category",
				header: "Category Name",
				size: 180,
			},
			{
				accessorKey: "parent_category_description",
				header: "Description",
				size: 230,
			},
			{
				accessorKey: "category_level",
				header: "Level",
				size: 100,
			},
			{
				accessorKey: "unspsc_code",
				header: "UNSPSC Code",
				size: 150,
			},
			{
				accessorKey: "categories",
				header: "Subcategories",
				size: 300,
				filterFn: "includesString",
				Cell: ({ cell }) => (
					<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
						{cell.getValue().map((category, index) => (
							<Chip
								key={index}
								label={category.category}
								title={`${category.category_id}: ${category.category_description}`}
								size="small"
								variant="outlined"
								sx={{
									borderRadius: "4px",
									"&:hover": {
										backgroundColor: "primary.light",
									},
								}}
							/>
						))}
					</Box>
				),
			},
		],
		[]
	);

	const handleIconTableImportClick = () => {
		setUploadDialogOpen(true);
	};

	const handleIconTableImport = (files) => {
		console.log("Uploaded files:", files);
		setUploadDialogOpen(false);
		// Handle file upload logic here
	};

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
		data: categories,
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
				<Tooltip title="Create New Category">
					<IconButton
						onClick={() => {
							setIsEditing(false);
							setCurrentCategory({
								parent_category_id: "",
								parent_category: "",
								parent_category_description: "",
								category_level: "",
								unspsc_code: "",
								categories: [],
							});
							setIsDialogOpen(true);
						}}
					>
						<AddIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="Export Data">
					<IconButton
						onClick={() =>
							handleExportRows(table.getPrePaginationRowModel().rows)
						}
					>
						<IconTableExport />
					</IconButton>
				</Tooltip>
				<Tooltip title="Import CSV">
					<IconButton onClick={handleIconTableImportClick}>
						<IconTableImport />
					</IconButton>
				</Tooltip>
				<MRT_ToggleFiltersButton table={table} />
				<MRT_ShowHideColumnsButton table={table} />
				<MRT_ToggleDensePaddingButton table={table} />
				<MRT_ToggleFullScreenButton table={table} />
			</Box>
		),
		onEditingRowCancel: () => {
			setIsEditing(false);
		},
		onEditingRow: () => {
			setIsEditing(false);
		},
		onEditingRowSave: async ({ table, values, row }) => {
			setIsEditing(true);
			setCurrentCategory(row.original);
			setIsDialogOpen(true);
			try {
				await updateCategory(row.original.form_id, values);
				dispatch(
					showSnackbar({
						message: `Form updated successfully!`,
						severity: "success",
					})
				);
				// Update the forms state with the new values
				setForms((prevForms) =>
					prevForms.map((form) =>
						form.form_id === values.form_id ? values : form
					)
				);
				table.setEditingRow(null); // exit editing mode
				setIsAdding(false);
			} catch (err) {
				console.error("Update error:", err);
				dispatch(
					showSnackbar({
						message: `Failed to update form!`,
						severity: "error",
					})
				);
			}
		},
		renderRowActionMenuItems: ({ row, table }) => [
			<MRT_ActionMenuItem
				key="edit"
				icon={<Edit />}
				label="Edit"
				onClick={() => {
					setIsEditing(true);
					setCurrentCategory(row.original);
					setIsDialogOpen(true);
				}}
				table={table}
			/>,
			<MRT_ActionMenuItem
				key="delete"
				icon={<DeleteIcon />}
				label="Delete"
				onClick={() => handleDeleteCategory(row.original.parent_category_id)}
				table={table}
			/>,
		],
		state: {
			isLoading,
			showProgressBars: isLoading,
			showLoadingOverlay: false,
		},
		muiSearchTextFieldProps: {
			placeholder: "Search all columns...",
			sx: { minWidth: "300px" },
			variant: "outlined",
		},
		muiTableHeadCellFilterTextFieldProps: {
			placeholder: "Filter...",
			sx: { minWidth: "100px" },
			variant: "outlined",
		},
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
			title="Category ID"
			caption="Easily manage and define product categories to streamline operations"
		>
			<MaterialReactTable table={table} />
			<CategoryDialog
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				title={isEditing ? "Edit Category" : "Add New Category"}
				category={currentCategory}
				setCategory={setCurrentCategory}
				onSave={handleSaveCategory}
				isEditing={isEditing}
			/>
			<FileUploadDialog
				open={uploadDialogOpen}
				onClose={() => setUploadDialogOpen(false)}
				onUpload={handleIconTableImport}
			/>
		</MainCard>
	);
};

export default CategoryID;
