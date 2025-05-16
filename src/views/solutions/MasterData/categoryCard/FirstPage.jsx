import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
	Container,
	Button,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	Link,
	Select,
	MenuItem,
	InputLabel,
	Chip,
	Typography,
	Switch,
	TextField,
	CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import countryList from "react-select-country-list";
import MainCard from "ui-component/cards/MainCard";
import useCategoryCard from "hooks/useCategoryCard";
import useCategoryID from "hooks/useCategoryId";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { display, styled } from "@mui/system";
import { Box } from "@mui/system";
import { LinearProgress } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchBar from "ui-component/SearchBar";

const SearchContainer = styled("div")({
	display: "flex",
	alignItems: "center",
	marginBottom: "20px",
	position: "relative",
});

const SearchInput = styled("Input")({
	width: "100%",
	height: "48px",
	padding: "12px 20px",
	fontSize: "16px",
	border: "1px solid #d2d2d2",
	borderRadius: "12px",
	outline: "none",
	transition: "all 0.3s ease",
	"&:focus": {
		boxShadow: "0 0 10px rgba(94, 23, 235, 0.2)",
	},
});

const TableHeader = styled("div")({
	"& .MuiDataGrid-columnHeaders": {
		backgroundColor: "#f0f0f0",
		"& .MuiDataGrid-columnHeaderTitle": {
			fontWeight: "bold",
			fontSize: "1rem",
			color: "#5e17eb",
		},
	},
});

const FirstPage = ({
	onCategorySelect,
	onAddCategories,
	categories,
	setCategories,
	handleStatusChange,
	categoryStates,
}) => {
	const { categoryCard, isLoading } = useCategoryCard();
	const { categoryId } = useCategoryID();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredRows, setFilteredRows] = useState([]);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [newCategory, setNewCategory] = useState({
		parent_category_id: "",
		parent_category_name: "",
		description: "",
		category_level: "",
		unspsc_code: "",
		categories: [],
		category_owner: "",
		country: "",
	});

	const allCategories = useMemo(
		() => [...categoryCard, ...categories],
		[categoryCard, categories]
	);

	useEffect(() => {
		setFilteredRows(allCategories);
	}, [allCategories]);

	const countries = useMemo(() => countryList().getData(), []);

	useEffect(() => {
		const filterRows = () => {
			if (searchTerm === "") {
				setFilteredRows(allCategories);
			} else {
				const lowercasedFilter = searchTerm.toLowerCase();
				const filteredData = allCategories.filter((row) => {
					return Object.keys(row).some((key) =>
						String(row[key]).toLowerCase().includes(lowercasedFilter)
					);
				});
				setFilteredRows(filteredData);
			}
		};
		filterRows();
	}, [searchTerm, allCategories]);

	const handleOpenAddDialog = () => {
		setOpenAddDialog(true);
	};

	const handleCloseAddDialog = () => {
		setOpenAddDialog(false);
		setNewCategory({
			parent_category_id: "",
			parent_category_name: "",
			description: "",
			category_level: "",
			unspsc_code: "",
			categories: [],
			category_owner: "",
			country: "",
		});
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setNewCategory((prev) => ({ ...prev, [name]: value }));
	};

	const handleCategoryIdChange = (event) => {
		const selectedId = event.target.value;
		const selectedCategory = categoryId.find(
			(cat) => cat.parent_category_id === selectedId
		);
		if (selectedCategory) {
			setNewCategory({
				...selectedCategory,
				categories: [],
				category_owner: "",
				country: "",
			});
		}
	};

	const handleSubcategoriesChange = (event) => {
		setNewCategory((prev) => ({ ...prev, categories: event.target.value }));
	};

	const handleSaveCategory = () => {
		if (
			!newCategory.parent_category_id ||
			!newCategory.category_owner ||
			!newCategory.country
		) {
			return;
		}

		const newCategories = newCategory.categories.map((subcategory) => ({
			...newCategory,
			subcategory_id: subcategory.category_id,
			subcategory_name: subcategory.category,
			category_card_id: `CCD_${subcategory.category_id}_${subcategory.category}_${newCategory.country}`,
			status: false,
		}));

		onAddCategories(newCategories);
		handleCloseAddDialog();
	};

	const handleCountryChange = (event) => {
		setNewCategory((prev) => ({ ...prev, country: event.target.value }));
	};

	const columns = useMemo(
		() => [
			{
				field: "category_card_id",
				headerName: "Category Card ID",
				flex: 2,
				renderCell: (params) => (
					<Link
						component="button"
						variant="body2"
						className="link-hover-effect"
						style={{
							color: "black",
							textDecoration: "none",
							position: "relative",
						}}
						onClick={() => onCategorySelect(params.row)}
					>
						{params.value}
					</Link>
				),
			},
			{
				field: "category_card_description",
				headerName: "Category Card Description",
				flex: 2,
			},
			{
				field: "parent_category_id",
				headerName: "Parent Category ID",
				flex: 1,
			},
			{
				field: "parent_category_name",
				headerName: "Parent Category Name",
				flex: 1.5,
			},
			{ field: "country", headerName: "Country", flex: 1 },
			{ field: "category_owner", headerName: "Category Owner", flex: 2 },
			{
				field: "status",
				headerName: "Status",
				flex: 1,
				renderCell: (params) => {
					const isChecked =
						categoryStates[params.row.category_card_id] !== undefined
							? categoryStates[params.row.category_card_id]
							: params.value;

					return (
						<Switch
							checked={isChecked}
							onChange={() => {
								handleStatusChange(params.row.category_card_id, !isChecked);
							}}
						/>
					);
				},
			},
		],
		[handleStatusChange, categoryStates]
	);

	const StyledGridOverlay = styled("div")(({ theme }) => ({
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		"& .no-rows-primary": {
			fill: "#AEB8C2",
		},
		"& .no-rows-secondary": {
			fill: "#E8EAED",
		},
	}));

	function CustomNoRowsOverlay() {
		return (
			<StyledGridOverlay>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					width="96"
					viewBox="0 0 452 257"
					aria-hidden="true"
					focusable="false"
				>
					<path
						class="no-rows-primary"
						d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
					></path>
					<path
						class="no-rows-primary"
						d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
					></path>
					<path
						class="no-rows-primary"
						d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
					></path>
					<path
						class="no-rows-secondary"
						d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
					></path>
				</svg>
				<Box sx={{ mt: 2 }}>Search product name to see supplier details</Box>
			</StyledGridOverlay>
		);
	}

	const CustomLoadingOverlay = () => (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				position: "relative",
			}}
		>
			<LinearProgress
				sx={{
					width: "100%",
					bgcolor: "#AE8BF5",
					position: "absolute",
					top: "0",
					"& .MuiLinearProgress-bar": { backgroundColor: "#5E17EB" },
				}}
			/>
			<Typography sx={{ mt: 2, color: "#696969" }}>Searching...</Typography>
		</Box>
	);

	return (
		<MainCard
			border={false}
			title="Category Card"
			caption="Quickly view specific metrics and details for each product category"
		>
			<Container maxWidth="2xl">
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<SearchBar onChangeFunction={(value) => setSearchTerm(value)} />
					<Tooltip placement="top" title="Create Category Card">
						<Button
							sx={{
								minWidth: "48px",
								width: "48px",
								height: "48px",
								borderRadius: "12px",
								marginLeft: "10px",
								border: "1px solid #2d2d2d",
								color: "#2d2d2d",
								"&:hover": {
									borderColor: "#2d2d2d",
								},
							}}
							onClick={handleOpenAddDialog}
						>
							<AddIcon
								sx={{
									color: "#2d2d2d",
								}}
							/>
						</Button>
					</Tooltip>
				</Box>

				<DataGrid
					rows={filteredRows}
					columns={columns}
					pageSize={10}
					rowsPerPageOptions={[5, 10]}
					disableSelectionOnClick
					disableColumnSelector
					disableDensitySelector
					checkboxSelection={false}
					getRowId={(row) =>
						row.category_card_id ||
						`temp-${row.parent_category_id}-${row.country}`
					}
					loading={isLoading}
					localeText={{
						noRowsLabel: "No Rows",
					}}
					slots={{
						noRowsOverlay: CustomNoRowsOverlay,
						loadingOverlay: CustomLoadingOverlay,
						footer: () => null,
					}}
					components={{
						NoRowsOverlay: () => (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
								}}
							>
								{isLoading && <>Loading...</>}
							</Box>
						),
					}}
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

				<Dialog
					open={openAddDialog}
					onClose={handleCloseAddDialog}
					maxWidth="md"
					fullWidth
				>
					<DialogTitle>
						<Typography variant="h2" sx={{ color: "#5e17eb" }}>
							Create Category Card
						</Typography>
					</DialogTitle>
					<DialogContent style={{ paddingTop: "20px" }}>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<FormControl
									fullWidth
									margin="normal"
									sx={{
										backgroundColor: "#fff",
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontSize: newCategory.parent_category_id ? "1.1rem" : "",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											"&.Mui-focused": {
												color: "#606060",
											},
											"&.MuiInputLabel-shrink": {
												fontSize: "1.1rem",
											},
										},
									}}
									required
								>
									<InputLabel id="category-id-label">
										Parent Category ID
									</InputLabel>
									<Select
										labelId="category-id-label"
										name="parent_category_id"
										value={newCategory.parent_category_id}
										onChange={handleCategoryIdChange}
										label="Parent Category ID"
										sx={{
											"& #mui-component-select-parent_category_id": {
												backgroundColor: "#fff",
												fontWeight: "bold",
												borderColor: "#606060",
											},
										}}
									>
										{categoryId &&
											categoryId.map((cat) => (
												<MenuItem
													key={cat.parent_category_id}
													value={cat.parent_category_id}
												>
													{cat.parent_category_id}
												</MenuItem>
											))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Parent Category Name"
									name="parent_category_name"
									value={newCategory?.parent_category}
									InputProps={{
										readOnly: true,
									}}
									InputLabelProps={{
										shrink: !!newCategory?.parent_category,
									}}
									margin="normal"
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},

										"& .MuiInputBase-input": {
											backgroundColor: "#fff",
											borderColor: "#606060",
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											fontSize: newCategory?.parent_category ? "1.1rem" : "",
											"&.Mui-focused": {
												borderColor: "#606060",
											},
										},
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Description"
									name="description"
									value={newCategory?.parent_category_description}
									InputProps={{
										readOnly: true,
									}}
									InputLabelProps={{
										shrink: !!newCategory?.parent_category_description,
									}}
									margin="normal"
									multiline
									rows={3}
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},

										"& .MuiInputBase-input": {
											backgroundColor: "#fff",
											borderColor: "#606060",
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											fontSize: newCategory?.parent_category ? "1.1rem" : "",
											"&.Mui-focused": {
												borderColor: "#606060",
											},
										},
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Category Level"
									name="category_level"
									value={newCategory.category_level}
									InputProps={{
										readOnly: true,
									}}
									InputLabelProps={{
										shrink: !!newCategory.category_level,
									}}
									margin="normal"
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},

										"& .MuiInputBase-input": {
											backgroundColor: "#fff",
											borderColor: "#606060",
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											fontSize: newCategory?.parent_category ? "1.1rem" : "",
											"&.Mui-focused": {
												borderColor: "#606060",
											},
										},
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="UNSPSC Code"
									name="unspsc_code"
									value={newCategory?.unspsc_code}
									InputProps={{
										readOnly: true,
									}}
									InputLabelProps={{
										shrink: !!newCategory?.unspsc_code,
									}}
									margin="normal"
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},

										"& .MuiInputBase-input": {
											backgroundColor: "#fff",
											borderColor: "#606060",
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											fontSize: newCategory?.parent_category ? "1.1rem" : "",
											"&.Mui-focused": {
												borderColor: "#606060",
											},
										},
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControl
									fullWidth
									margin="normal"
									sx={{
										backgroundColor: "#fff",
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											"&.Mui-focused": {
												fontSize: "1.1rem",
												color: "#606060",
											},
										},
									}}
									disabled={!newCategory.parent_category_id}
								>
									<InputLabel id="subcategories-label">
										Category Card
									</InputLabel>
									<Select
										labelId="subcategories-label"
										multiple
										name="subcategories"
										value={newCategory.categories}
										onChange={handleSubcategoriesChange}
										label="Category Card"
										sx={{
											"& #mui-component-select-subcategories": {
												backgroundColor: "#fff",
												fontWeight: "bold",
												borderColor: "#606060",
											},
										}}
										renderValue={(selected) => (
											<div
												style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
											>
												{selected.map((value) => (
													<Chip
														key={value.id}
														label={`${value.category_id}: ${value.category}`}
													/>
												))}
											</div>
										)}
									>
										{newCategory.parent_category_id &&
											categoryId
												.find(
													(cat) =>
														cat.parent_category_id ===
														newCategory.parent_category_id
												)
												?.categories.map((subcategory) => (
													<MenuItem
														key={subcategory.category_id}
														value={subcategory}
													>
														{`${subcategory.category_id}: ${subcategory?.category}`}
													</MenuItem>
												))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Category Owner"
									name="category_owner"
									value={newCategory.category_owner}
									onChange={handleInputChange}
									margin="normal"
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},
										"& .MuiInputBase-input": {
											backgroundColor: "#fff",
											borderColor: "#606060",
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",
											fontSize: newCategory?.category_owner ? "1.1rem" : "",
											"&.Mui-focused": {
												color: "#606060",
												borderColor: "#606060",
											},
											"&.MuiInputLabel-shrink": {
												fontSize: "1.1rem",
											},
										},
									}}
									required
								/>
							</Grid>
							<Grid item xs={6}>
								<FormControl
									fullWidth
									margin="normal"
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "#606060",
											},
											"&:hover fieldset": {
												borderColor: "#606060",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#606060",
											},
										},
										"& .MuiInputLabel-root": {
											color: "#606060",
											fontWeight: "500",
											backgroundColor: "#fff",
											paddingRight: "2px",

											"&.Mui-focused": {
												color: "#606060",
											},
											"&.MuiInputLabel-shrink": {
												fontSize: "1.1rem",
											},
										},
									}}
									required
								>
									<InputLabel id="country-label">Country</InputLabel>
									<Select
										labelId="country-label"
										name="country"
										value={newCategory.country}
										onChange={handleCountryChange}
										sx={{
											"& #mui-component-select-country": {
												backgroundColor: "#fff",
												fontWeight: "bold",
												borderColor: "#606060",
											},
											display: "flex",
											alignItems: "center",
											position: "relative",
										}}
										label="Country"
									>
										{countries.map((country) => (
											<MenuItem key={country.value} value={country.value}>
												<span
													className={`flag-icon flag-icon-${country.value.toLowerCase()}`}
													sx={{
														cursor: "pointer",
														color: "#606060",
														backgroundColor: "#fff",
														padding: "4px",
														borderRadius: "50%",
													}}
												></span>
												{country.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseAddDialog}
							sx={{
								color: "#5e17eb",
								"&:hover": {
									backgroundColor: "#f7f7f7",
								},
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSaveCategory}
							variant="contained"
							color="primary"
							disabled={
								!newCategory.parent_category_id ||
								!newCategory.category_owner ||
								!newCategory.country
							}
							sx={{
								backgroundColor: "#5e17eb",
								"&:hover": {
									backgroundColor: "#5e17eb",
								},
							}}
						>
							Save
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</MainCard>
	);
};

export default FirstPage;
