import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Typography,
	Paper,
	TextField,
	IconButton,
	Button,
} from "@mui/material";
import { FileText, Plus, Edit2, Save, X, Trash2 } from "lucide-react";

import {
	addDocumentType,
	updateDocumentType,
	deleteDocumentType,
	saveDocumentTypes,
	startEditing,
	cancelEditing,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/documentTypesSlice";
import { documentSelectors } from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/selectors/documentTypesSelectors";

// Memoized EmptyState component
const EmptyDocumentTypes = React.memo(() => (
	<Box
		sx={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			p: 6,
			borderRadius: 1,
			bgcolor: "grey.50",
			border: "2px dashed",
			borderColor: "grey.200",
			minHeight: 300,
			width: "100%",
		}}
	>
		<Box
			sx={{
				bgcolor: "grey.100",
				p: 2,
				borderRadius: "50%",
				mb: 2,
			}}
		>
			<FileText size={48} color="#9e9e9e" />
		</Box>

		<Typography
			variant="h6"
			sx={{
				color: "text.primary",
				mb: 1,
				fontWeight: 500,
			}}
		>
			No Document Types Added
		</Typography>

		<Typography
			variant="body2"
			sx={{
				color: "text.secondary",
				textAlign: "center",
				maxWidth: 400,
				mb: 3,
			}}
		>
			Start by clicking the "Add another document" button to create document
			types for your RFP forms.
		</Typography>

		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				color: "text.disabled",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<Box
					sx={{
						width: 8,
						height: 8,
						borderRadius: "50%",
						bgcolor: "grey.400",
					}}
				/>
				<Typography variant="caption">Document Type Name</Typography>
			</Box>
		</Box>
	</Box>
));

// Memoized DocumentTypeField component
const DocumentTypeField = React.memo(
	({ docType, isEditing, isSaved, onDelete, onChange }) => (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				mb: 2,
			}}
		>
			{isEditing || (!isSaved && !isEditing) ? (
				<>
					<TextField
						fullWidth
						placeholder="Enter document type"
						value={docType.value}
						onChange={(e) => onChange(docType.id, e.target.value)}
						size="small"
					/>
					<IconButton
						size="small"
						onClick={() => onDelete(docType.id, isSaved)}
						sx={{ color: "error.main" }}
					>
						<Trash2 size={20} />
					</IconButton>
				</>
			) : (
				<TextField
					fullWidth
					value={docType.value}
					disabled={true}
					size="small"
				/>
			)}
		</Box>
	)
);

// Memoized DocumentTypeFields component
const DocumentTypeFields = React.memo(
	({ isEditing, documentTypes, savedTypes, onDelete, onChange }) => (
		<>
			{isEditing ? (
				<>
					{documentTypes.map((docType) => (
						<DocumentTypeField
							key={docType.id}
							docType={docType}
							isEditing={isEditing}
							isSaved={false}
							onDelete={onDelete}
							onChange={onChange}
						/>
					))}
					{savedTypes.map((docType) => (
						<DocumentTypeField
							key={docType.id}
							docType={docType}
							isEditing={isEditing}
							isSaved={true}
							onDelete={onDelete}
							onChange={onChange}
						/>
					))}
				</>
			) : (
				<>
					{documentTypes.map((docType) => (
						<DocumentTypeField
							key={docType.id}
							docType={docType}
							isEditing={isEditing}
							isSaved={false}
							onDelete={onDelete}
							onChange={onChange}
						/>
					))}
					{savedTypes.map((docType) => (
						<DocumentTypeField
							key={docType.id}
							docType={docType}
							isEditing={isEditing}
							isSaved={true}
							onDelete={onDelete}
							onChange={onChange}
						/>
					))}
				</>
			)}
		</>
	)
);

const DocumentType = () => {
	const dispatch = useDispatch();
	const {
		documentTypes,
		savedTypes,
		isLoading,
		error,
		isEditing,
		hasDocumentTypes,
		hasValidTypes,
	} = useSelector(documentSelectors);

	// Memoized handlers
	const handleAddField = useCallback(() => {
		dispatch(addDocumentType());
	}, [dispatch]);

	const handleChange = useCallback(
		(id, value) => {
			dispatch(updateDocumentType({ id, value }));
		},
		[dispatch]
	);

	const handleDelete = useCallback(
		(id, isSaved) => {
			dispatch(deleteDocumentType({ id, isSaved }));
		},
		[dispatch]
	);

	const handleSave = useCallback(() => {
		dispatch(saveDocumentTypes());
	}, [dispatch]);

	const handleEdit = useCallback(() => {
		dispatch(startEditing());
	}, [dispatch]);

	const handleCancelEdit = useCallback(() => {
		dispatch(cancelEditing());
	}, [dispatch]);

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
						<FileText size={24} />
						<Typography
							variant="h4"
							sx={{ color: "common.black", fontWeight: "medium" }}
						>
							Document Type
						</Typography>
					</Box>

					<Typography
						variant="body2"
						sx={{
							color: "text.secondary",
							mb: 4,
							textAlign: "justify",
						}}
					>
						Add new types, edit existing ones, and remove types that are no
						longer needed.
					</Typography>

					{!isEditing ? (
						<Box sx={{ display: "flex", gap: 2 }}>
							<Button
								onClick={handleAddField}
								startIcon={<Plus size={20} />}
								variant="contained"
							>
								Add Document
							</Button>
							{savedTypes.length > 0 && (
								<Button onClick={handleEdit} startIcon={<Edit2 size={20} />}>
									Edit
								</Button>
							)}
						</Box>
					) : (
						<Box sx={{ display: "flex", gap: 2 }}>
							<Button
								onClick={handleSave}
								startIcon={<Save size={20} />}
								variant="contained"
								sx={{
									bgcolor: "secondary.dark",
									color: "white",
									fontWeight: "medium",
									p: 1,
									px: 2,
									"&:hover": {
										bgcolor: "secondary.main",
									},
								}}
								disabled={!hasValidTypes || isLoading}
							>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
							<Button onClick={handleCancelEdit} startIcon={<X size={20} />}>
								Cancel
							</Button>
						</Box>
					)}

					{error && (
						<Typography
							variant="body2"
							sx={{
								mt: 2,
								color: "error.main",
							}}
						>
							{error}
						</Typography>
					)}
				</Box>

				<Box>
					{!hasDocumentTypes ? (
						<EmptyDocumentTypes />
					) : (
						<DocumentTypeFields
							isEditing={isEditing}
							documentTypes={documentTypes}
							savedTypes={savedTypes}
							onDelete={handleDelete}
							onChange={handleChange}
						/>
					)}
				</Box>
			</Box>
		</Paper>
	);
};

export default React.memo(DocumentType);
