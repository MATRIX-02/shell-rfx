import React, { useState, useMemo } from "react";
import {
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	IconButton,
	Chip,
	Fade,
	Tooltip,
	Button,
	DialogActions,
	TextField,
	DialogContent,
	Dialog,
	DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import MainCard from "ui-component/cards/MainCard";
import { styled } from "@mui/system";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EditIcon from "@mui/icons-material/Edit";
import { keyframes } from "styled-components";
import SearchBar from "ui-component/SearchBar";
import ESCustomTable from "ui-component/ESCustomTable";

const CustomAccordion = styled(Accordion)({
	boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
	borderRadius: "12px !important",
	"&:before": {
		display: "none",
	},
	marginBottom: "16px",
});

const CustomAccordionSummary = styled(AccordionSummary)({
	borderRadius: "12px",
	"& .MuiAccordionSummary-content": {
		margin: "12px 0",
		alignItems: "center",
	},
});

const AnimatedTypography = styled(Typography)(({ theme, expanded }) => ({
	transition: "all 0.3s ease",
	color: "#9747ff",
	fontWeight: "bold",
	fontSize: expanded
		? theme.typography.h2.fontSize
		: theme.typography.h4.fontSize,
}));

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ScenarioActivation = () => {
	const handleDeleteRow = (row) => {
		setRows((prevRows) => prevRows.filter((r) => r.id !== row.id));
	};
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editingRow, setEditingRow] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedPanel, setExpandedPanel] = useState(null);
	const [sections, setSections] = useState([
		{ title: "Scenario Activation", type: "scenario" },
		{ title: "Approval Threshold", type: "approval" },
	]);
	const [rows, setRows] = useState([
		{
			id: 1,
			company: "Company A",
			country: "USA",
			categoryId: "CAT001",
			poDocumentType: "Type 1",
			poConfirmationEmail: "Yes",
			confirmationUrl: "http://example.com",
		},
		{
			id: 2,
			company: "Company B",
			country: "Canada",
			categoryId: "CAT002",
			poDocumentType: "Type 2",
			poConfirmationEmail: "No",
			confirmationUrl: "http://example2.com",
		},
	]);

	const [openAddDialog, setOpenAddDialog] = useState(false);

	const [newRow, setNewRow] = useState({});

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedPanel(isExpanded ? panel : null);
	};

	const filteredRows = rows.filter((row) =>
		Object.values(row).some((value) =>
			value.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const handleAddRow = () => {
		setNewRow({
			id: rows.length + 1,
			company: "",
			country: "",
			categoryId: "",
			poDocumentType: "",
			poConfirmationEmail: "",
			confirmationUrl: "",
		});
		setOpenAddDialog(true);
	};
	const handleEditRow = (row) => {
		setEditingRow({ ...row });
		setOpenEditDialog(true);
	};

	const handleSaveEdit = () => {
		setRows((prevRows) =>
			prevRows.map((row) => (row.id === editingRow.id ? editingRow : row))
		);
		setOpenEditDialog(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditingRow((prev) => ({ ...prev, [name]: value }));
	};
	const filteredSections = sections.filter((section) =>
		section.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const columns = useMemo(
		() => [
			{ accessorKey: "company", header: "Company", size: 150 },
			{ accessorKey: "country", header: "Country", size: 150 },
			{
				accessorKey: "categoryId",
				header: () => (
					<Box
						display="flex"
						alignItems="center"
						position="relative"
						padding="3px 1rem 0 0"
					>
						Category ID
						<VpnKeyIcon
							sx={{
								fontSize: "0.75rem",
								color: "green",
								position: "absolute",
								right: "-.01rem",
								top: "0",
							}}
						/>
					</Box>
				),
				size: 150,
			},
			{
				accessorKey: "poDocumentType",
				header: "PO Document Type",
				size: 200,
			},
			{
				accessorKey: "poConfirmationEmail",
				header: "PO Confirmation email automation",
				size: 250,
			},
			{
				accessorKey: "confirmationUrl",
				header: "Confirmation URL",
				size: 200,
			},
			{
				accessorKey: "actions",
				header: "Actions",
				size: 120,
				Cell: ({ row }) => (
					<Box>
						<IconButton
							onClick={() => handleEditRow(row.original)}
							color="primary"
							size="small"
						>
							<EditIcon />
						</IconButton>
						<IconButton
							onClick={() => handleDeleteRow(row.original)}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				),
			},
		],
		[]
	);

	return (
		<MainCard
			title="Scenario Activation"
			caption="Manage and customize the screen fields required for your forms, ensuring accurate data collection"
		>
			<SearchBar
				variant="searchAsYouType"
				onChangeFunction={(value) => setSearchTerm(value)}
			/>

			<Box sx={{ width: "100%", padding: "1rem 0" }}>
				{filteredSections.map((section, index) => (
					<CustomAccordion
						sx={{ border: "1px solid #c4c4c4" }}
						key={index}
						expanded={expandedPanel === index}
						onChange={handleAccordionChange(index)}
					>
						<CustomAccordionSummary
							expandIcon={
								<ExpandMoreIcon
									sx={{
										color: "#9747ff",
									}}
								/>
							}
							aria-controls={`panel${index}a-content`}
							id={`panel${index}a-header`}
							onClick={(event) => {
								if (event.target.closest("button")) {
									event.stopPropagation();
								}
							}}
						>
							<AnimatedTypography expanded={expandedPanel === index}>
								{section.title}
							</AnimatedTypography>
							<Tooltip title="Information" placement="top">
								{expandedPanel === index && (
									<IconButton>
										<InfoIcon sx={{ fontSize: "21px", color: "#9747ff" }} />
									</IconButton>
								)}
							</Tooltip>

							<Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
								<Fade in={expandedPanel === index} timeout={300}>
									<Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
										<Typography component="span" sx={{ mr: 1 }}>
											Icon Legend:
										</Typography>
										<Chip
											icon={<VpnKeyIcon />}
											label="Key"
											size="medium"
											sx={{
												bgcolor: "#e8f5e9",
												color: "#2e7d32",
												fontSize: "0.9rem",
												padding: "4px 8px",
												"& .MuiChip-icon": {
													color: "#2e7d32",
													fontSize: "1.2rem",
												},
											}}
										/>
										<IconButton
											size="small"
											sx={{ color: "#9747ff", ml: 1 }}
											onClick={(e) => {
												e.stopPropagation();
												handleAddRow();
											}}
										>
											<AddIcon />
										</IconButton>
									</Box>
								</Fade>
							</Box>
						</CustomAccordionSummary>
						<ESCustomTable
							columns={columns}
							data={filteredRows}
							enableRowSelection
							enableSorting={true}
							enablePagination={true}
							enableTopToolbar={true}
							enableBottomToolbar={true}
							enableColumnActions={false}
							enableDensityToggle={false}
							enableHiding={false}
							muiTableProps={{
								sx: {
									border: "1px solid #ddd",
									borderRadius: "8px",
								},
							}}
							muiSearchTextFieldProps={{
								placeholder: "Search...",
								sx: { minWidth: "300px" },
								variant: "outlined",
								size: "small",
								InputProps: {
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								},
							}}
						/>
					</CustomAccordion>
				))}
			</Box>
			<Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
				<DialogTitle>Edit Row</DialogTitle>
				<DialogContent>
					{editingRow && (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: "1rem",
								pt: 2,
							}}
						>
							<TextField
								name="company"
								label="Company"
								value={editingRow.company}
								onChange={handleInputChange}
							/>
							<TextField
								name="country"
								label="Country"
								value={editingRow.country}
								onChange={handleInputChange}
							/>
							<TextField
								name="categoryId"
								label="Category ID"
								value={editingRow.categoryId}
								onChange={handleInputChange}
							/>
							<TextField
								name="poDocumentType"
								label="PO Document Type"
								value={editingRow.poDocumentType}
								onChange={handleInputChange}
							/>
							<TextField
								name="poConfirmationEmail"
								label="PO Confirmation Email"
								value={editingRow.poConfirmationEmail}
								onChange={handleInputChange}
							/>
							<TextField
								name="confirmationUrl"
								label="Confirmation URL"
								value={editingRow.confirmationUrl}
								onChange={handleInputChange}
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
					<Button onClick={handleSaveEdit} variant="contained" color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</MainCard>
	);
};

export default ScenarioActivation;
