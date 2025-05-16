import React, { useState, useMemo } from "react";
import {
	Box,
	Typography,
	Paper,
	IconButton,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Alert,
} from "@mui/material";
import {
	Plus,
	Trash2,
	ChevronDown,
	AlertCircle,
	CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ESCustomTextField from "ui-component/ESCustomTextField";
import { selectSavedTypes } from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/selectors/documentTypesSelectors";
import {
	addValidationRule,
	updateValidationRule,
	removeValidationRule,
	saveValidations,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/dataValidationSlice";
import {
	selectAllValidations,
	selectValidationsLoading,
	selectValidationsError,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/selectors/dataValidationSelectors";
import ESCustomTextArea from "ui-component/ESCustomTextArea";

// Separate component for individual validation rule
const ValidationRule = ({ rule, docTypeId, onUpdate, onRemove }) => (
	<Box
		sx={{
			border: "1px solid #ddd",
			borderRadius: 1,
			p: 2,
			gap: 2,
			mb: 3,
		}}
	>
		<Box>
			<Typography
				variant="body2"
				sx={{
					mb: 1,
					fontWeight: 500,
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				Contradiction Name
				<IconButton
					size="small"
					onClick={() => onRemove(docTypeId, rule.id)}
					sx={{ color: "error.main" }}
				>
					<Trash2 size={20} />
				</IconButton>
			</Typography>

			<ESCustomTextField
				size="small"
				value={rule.contradictionName}
				onChange={(e) =>
					onUpdate(docTypeId, rule.id, "contradictionName", e.target.value)
				}
				inputPropsSx={{ backgroundColor: "transparent" }}
				placeholder="Enter contradiction name"
			/>
		</Box>
		<Box>
			<Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
				Prompt
			</Typography>
			<ESCustomTextArea
				fullWidth
				size="small"
				value={rule.prompt}
				onChange={(e) => onUpdate(docTypeId, rule.id, "prompt", e.target.value)}
				inputPropsSx={{ backgroundColor: "transparent" }}
				placeholder="Enter validation prompt"
			/>
		</Box>
		<Box sx={{ mt: 3.5 }}></Box>
	</Box>
);

// Separate component for document type validation section
const DocumentTypeValidation = ({
	docType,
	validations,
	onAddValidation,
	onUpdateValidation,
	onRemoveValidation,
	isExpanded,
	onExpand,
}) => {
	const rules = validations[docType.id] || [];

	return (
		<Accordion
			expanded={isExpanded}
			onChange={onExpand}
			sx={{
				mb: 2,
				"&:before": {
					display: "none",
				},
				boxShadow: "none",
				bgcolor: "grey.50",
				border: "1px solid",
				borderColor: "grey.200",
			}}
		>
			<AccordionSummary
				expandIcon={<ChevronDown size={20} />}
				sx={{
					"& .MuiAccordionSummary-content": {
						alignItems: "center",
					},
				}}
			>
				<Typography sx={{ fontWeight: 500 }}>{docType.value}</Typography>
				<Typography variant="body2" sx={{ color: "text.secondary", ml: 1 }}>
					({rules.length} validations)
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Box sx={{ pt: 1 }}>
					{rules.map((rule) => (
						<ValidationRule
							key={rule.id}
							rule={rule}
							docTypeId={docType.id}
							onUpdate={onUpdateValidation}
							onRemove={onRemoveValidation}
						/>
					))}
					<Button
						onClick={() => onAddValidation(docType.id)}
						size="small"
						sx={{
							color: "#000",
							bgcolor: "#f6f7f9",
							fontWeight: "medium",
							p: 1,
							px: 2,
							"&:hover": {
								bgcolor: "#e8e9eb",
							},
						}}
					>
						<Plus size={20} /> &nbsp; Add Validation Rule
					</Button>
				</Box>
			</AccordionDetails>
		</Accordion>
	);
};

const DataValidation = () => {
	const dispatch = useDispatch();

	// Selectors
	const documentTypes = useSelector(selectSavedTypes);
	const allValidations = useSelector(selectAllValidations);
	const isLoading = useSelector(selectValidationsLoading);
	const error = useSelector(selectValidationsError);

	// Local state
	const [expandedPanel, setExpandedPanel] = useState(false);

	// Handlers
	const handleAddValidation = (docTypeId) => {
		dispatch(addValidationRule({ documentTypeId: docTypeId }));
	};

	const handleUpdateValidation = (docTypeId, ruleId, field, value) => {
		dispatch(
			updateValidationRule({
				documentTypeId: docTypeId,
				ruleId,
				field,
				value,
			})
		);
	};

	const handleRemoveValidation = (docTypeId, ruleId) => {
		dispatch(removeValidationRule({ documentTypeId: docTypeId, ruleId }));
	};

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpandedPanel(isExpanded ? panel : false);
	};

	const handleSave = () => {
		dispatch(saveValidations());
	};

	return (
		<Paper elevation={0} sx={{ p: 3, mb: 3 }}>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "300px 1fr",
					gap: 7,
				}}
			>
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<CheckCircle size={24} />
						<Typography
							variant="h4"
							sx={{ color: "common.black", fontWeight: "medium" }}
						>
							Data Validation
						</Typography>
					</Box>
					<Typography
						variant="body2"
						sx={{
							color: "text.secondary",
							mb: 2,
							textAlign: "justify",
						}}
					>
						Add validation rules to your document types to ensure data
						consistency. Each validation can check for contradictions using
						custom prompts.
					</Typography>
					{/* <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
						<Button
							onClick={handleSave}
							variant="contained"
							disabled={isLoading}
						>
							{isLoading ? "Saving..." : "Save All Validations"}
						</Button>
					</Box> */}

					{error && (
						<Alert severity="error" sx={{ mt: 2 }}>
							{error}
						</Alert>
					)}
				</Box>

				<Box>
					{documentTypes?.length === 0 ? (
						<Alert
							severity="info"
							icon={<AlertCircle size={20} />}
							sx={{
								"& .MuiAlert-icon": {
									alignItems: "center",
								},
							}}
						>
							No document types found. Please add document types first to
							configure validations.
						</Alert>
					) : (
						<Box sx={{ width: "100%" }}>
							{documentTypes?.map((docType) => (
								<DocumentTypeValidation
									key={docType.id}
									docType={docType}
									validations={allValidations}
									onAddValidation={handleAddValidation}
									onUpdateValidation={handleUpdateValidation}
									onRemoveValidation={handleRemoveValidation}
									isExpanded={expandedPanel === docType.id}
									onExpand={handleAccordionChange(docType.id)}
								/>
							))}
						</Box>
					)}
				</Box>
			</Box>
		</Paper>
	);
};

export default DataValidation;
