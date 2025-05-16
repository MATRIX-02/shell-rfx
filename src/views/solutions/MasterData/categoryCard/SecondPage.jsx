import { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Chip,
	Divider,
	IconButton,
	TextField,
	Checkbox,
	Tooltip,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import SupplierData from "./SupplierData";
import { MENU_TOGGLE } from "store/actions";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
	spacing: 8, // Ensure spacing function is included
	palette: {
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
		grey: {
			500: "#9e9e9e",
		},
	},
});

const SecondPage = ({
	category,
	onClose,
	handleStatusChange,
	categoryCardId,
	categoryName,
	categoryStates,
	spendPatternData,
	parentCategoryName,
}) => {
	const isMenuOpen = useSelector((state) => state.customization.opened);

	if (!category) return null;
	const mainCardContent = (
		<>
			<Box display="flex" flexDirection="row" gap={2} mb={2} mt={6}>
				<Box flex={1} sx={{ marginBottom: theme.spacing(3) }}>
					<Typography
						variant="subtitle1"
						sx={{
							color: "#5e17eb",
							mb: 1,
							fontSize: "1rem",
							display: "flex",
							alignItems: "center",
						}}
					>
						Category Card Id
						<Chip
							label={
								categoryStates[category?.category_card_id]
									? "Activated"
									: "Deactivated"
							}
							color={
								categoryStates[category?.category_card_id]
									? "success"
									: "default"
							}
							size="small"
							sx={{
								bgcolor: categoryStates[category?.category_card_id]
									? "#3CB844"
									: "default",
								color: categoryStates[category?.category_card_id]
									? "white"
									: "#444444",
								marginLeft: theme.spacing(1),
								verticalAlign: "middle",
							}}
						/>
					</Typography>
					<TextField
						fullWidth
						variant="outlined"
						value={category?.category_card_id}
						InputProps={{
							readOnly: true,
							style: {
								height: "40px",
								backgroundColor: "white",
							},
						}}
						sx={{
							backgroundColor: "white !important",
							"& .MuiOutlinedInput-root": {
								backgroundColor: "white !important",
								"& input": {
									backgroundColor: "white !important",
								},
								"& fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
								},
								"&:hover fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
								},
								"&.Mui-focused fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
									borderWidth: "1px",
								},
							},
						}}
					/>
				</Box>

				<Box flex={1} sx={{ marginBottom: theme.spacing(3) }}>
					<Typography
						variant="subtitle1"
						sx={{ color: "#5e17eb", mb: 1, fontSize: "1rem" }}
					>
						Category Owner
					</Typography>
					<TextField
						fullWidth
						variant="outlined"
						value={category.category_owner}
						InputProps={{
							readOnly: true,
							style: {
								height: "40px",
								backgroundColor: "white",
							},
						}}
						sx={{
							backgroundColor: "white !important",
							"& .MuiOutlinedInput-root": {
								backgroundColor: "white !important",
								"& input": {
									backgroundColor: "white !important",
								},
								"& fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
								},
								"&:hover fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
								},
								"&.Mui-focused fieldset": {
									borderColor: "rgba(0, 0, 0, 0.23)",
									borderWidth: "1px",
								},
							},
						}}
					/>
				</Box>
			</Box>
			<Box sx={{ marginBottom: theme.spacing(3) }}>
				<Typography
					variant="subtitle1"
					sx={{ color: "#5e17eb", mb: 1, fontSize: "1rem" }}
				>
					Category Card Description
				</Typography>
				<TextField
					fullWidth
					variant="outlined"
					value={category.category_card_description}
					InputProps={{
						readOnly: true,
						style: {
							height: "40px",
							backgroundColor: "white",
						},
					}}
					sx={{
						backgroundColor: "white !important",
						"& .MuiOutlinedInput-root": {
							backgroundColor: "white !important",
							"& input": {
								backgroundColor: "white !important",
							},
							"& fieldset": {
								borderColor: "rgba(0, 0, 0, 0.23)",
							},
							"&:hover fieldset": {
								borderColor: "rgba(0, 0, 0, 0.23)",
							},
							"&.Mui-focused fieldset": {
								borderColor: "rgba(0, 0, 0, 0.23)",
								borderWidth: "1px",
							},
						},
					}}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					gap: theme.spacing(1),
					marginBottom: theme.spacing(2),
					flexWrap: "wrap",
				}}
			>
				<Chip
					label={`Parent Category ID: ${category.parent_category_id}`}
					color="primary"
					variant="outlined"
				/>
				<Chip
					label={`Category Level: ${category.category_level}`}
					color="secondary"
					variant="outlined"
				/>
				<Chip
					label={`UNSPSC Code: ${category.unspsc_code}`}
					color="info"
					variant="outlined"
				/>
				<Chip
					label={`Country: ${category.country}`}
					color="secondary"
					variant="outlined"
				/>
			</Box>
			<Divider sx={{ margin: theme.spacing(3, 0) }} />
			<SupplierData
				categoryCardId={categoryCardId}
				categoryName={categoryName}
				spendPatternData={spendPatternData}
				parentCategoryName={category.parent_category_name}
			/>
		</>
	);

	return (
		<>
			<Tooltip title="Back" placement="right" arrow>
				<IconButton
					aria-label="back"
					onClick={onClose}
					sx={{
						margin: "1rem 0 -1.2rem 1rem",
						color: "#9747FF",
						zIndex: 1,
						transition: "left 0.3s",
					}}
				>
					<IconArrowLeft size={25} />
				</IconButton>
			</Tooltip>
			<MainCard
				border={false}
				title="Category Card Details"
				caption="Manage your products and services to streamline process, policies to manage risk and cost"
			>
				{mainCardContent}
			</MainCard>
		</>
	);
};

export default SecondPage;
