import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	Divider,
	IconButton,
	Grid,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ESCustomTextField from "ui-component/ESCustomTextField";

const CategoryDialog = ({
	open,
	onClose,
	title,
	category,
	setCategory,
	onSave,
	isEditing,
}) => {
	const handleCategoryChange = (index, field, value) => {
		const updatedCategories = [...category.categories];
		updatedCategories[index] = { ...updatedCategories[index], [field]: value };
		setCategory({ ...category, categories: updatedCategories });
	};

	const handleAddCategory = () => {
		setCategory({
			...category,
			categories: [
				...category.categories,
				{ category_id: "", category: "", category_description: "" },
			],
		});
	};

	const handleRemoveCategory = (index) => {
		const updatedCategories = category.categories.filter((_, i) => i !== index);
		setCategory({ ...category, categories: updatedCategories });
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle
				sx={{
					bgcolor: "secondary.dark",
					color: "primary.contrastText",
					fontSize: 20,
				}}
			>
				{title}
			</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ mb: 3 }}>
					<Typography
						variant="h4"
						sx={{ textDecoration: "underline" }}
						gutterBottom
					>
						Parent Category Details
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<ESCustomTextField
								label="Parent Category ID"
								value={category.parent_category_id}
								width="100%"
								onChange={(e) =>
									setCategory({
										...category,
										parent_category_id: e.target.value,
									})
								}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<ESCustomTextField
								label="Parent Category"
								value={category.parent_category}
								onChange={(e) =>
									setCategory({ ...category, parent_category: e.target.value })
								}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12}>
							<ESCustomTextField
								label="Parent Category Description"
								value={category.parent_category_description}
								onChange={(e) =>
									setCategory({
										...category,
										parent_category_description: e.target.value,
									})
								}
								fullWidth
								multiline
								rows={2}
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<ESCustomTextField
								label="Category Level"
								value={category.category_level}
								onChange={(e) =>
									setCategory({ ...category, category_level: e.target.value })
								}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<ESCustomTextField
								label="UNSPSC Code"
								value={category.unspsc_code}
								onChange={(e) =>
									setCategory({ ...category, unspsc_code: e.target.value })
								}
								fullWidth
								margin="normal"
							/>
						</Grid>
					</Grid>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box
					sx={{
						mb: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h4" sx={{ textDecoration: "underline" }}>
						Categories
					</Typography>
					<Button
						startIcon={<AddIcon />}
						onClick={handleAddCategory}
						variant="outlined"
					>
						Add Category
					</Button>
				</Box>

				{category.categories.map((cat, index) => (
					<Box
						key={index}
						sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
					>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} sm={4}>
								<ESCustomTextField
									label="Category ID"
									value={cat.category_id}
									onChange={(e) =>
										handleCategoryChange(index, "category_id", e.target.value)
									}
									fullWidth
									margin="dense"
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<ESCustomTextField
									label="Category"
									value={cat.category}
									onChange={(e) =>
										handleCategoryChange(index, "category", e.target.value)
									}
									fullWidth
									margin="dense"
								/>
							</Grid>
							<Grid item xs={12} sm={4}>
								<ESCustomTextField
									label="Category Description"
									value={cat.category_description}
									onChange={(e) =>
										handleCategoryChange(
											index,
											"category_description",
											e.target.value
										)
									}
									fullWidth
									margin="dense"
								/>
							</Grid>
							<Grid item xs={12} display="flex" justifyContent="flex-end">
								<IconButton
									onClick={() => handleRemoveCategory(index)}
									color="error"
								>
									<DeleteIcon />
								</IconButton>
							</Grid>
						</Grid>
					</Box>
				))}
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2, bgcolor: "grey.100" }}>
				<Button onClick={onClose} variant="outlined">
					Cancel
				</Button>
				<Button onClick={onSave} variant="contained" color="primary">
					{isEditing ? "Update" : "Create"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CategoryDialog;
