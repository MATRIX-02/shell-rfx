import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Typography,
	Paper,
	Button,
	IconButton,
	Card,
	CardContent,
	Chip,
	Collapse,
	Alert,
} from "@mui/material";
import { Plus, Trash2, Edit2, Save, X, Inbox, Mail, Edit } from "lucide-react";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomTextArea from "ui-component/ESCustomTextArea";
import {
	startCreating,
	cancelCreating,
	updateCurrentContext,
	addContext,
	updateContext,
	deleteContext,
	startEditing,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/emailSummariseSlice";
import {
	selectContexts,
	selectIsLoading,
	selectError,
	selectIsCreating,
	selectEditingId,
	selectCurrentContext,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/selectors/emailSummariseSelectors";

const EmailSummarise = () => {
	const dispatch = useDispatch();
	const contexts = useSelector(selectContexts);
	const isCreating = useSelector(selectIsCreating);
	const editingId = useSelector(selectEditingId);
	const currentContext = useSelector(selectCurrentContext);
	const isLoading = useSelector(selectIsLoading);
	const error = useSelector(selectError);

	const handleStartCreate = () => {
		dispatch(startCreating());
	};

	const handleCancel = () => {
		dispatch(cancelCreating());
	};

	const handleSave = () => {
		if (editingId !== null) {
			dispatch(updateContext());
		} else {
			dispatch(addContext());
		}
	};

	const handleEdit = (context) => {
		dispatch(startEditing(context.id));
	};

	const handleDelete = (id) => {
		dispatch(deleteContext(id));
	};

	const handleContextChange = (field, value) => {
		dispatch(updateCurrentContext({ [field]: value }));
	};

	const isFormValid = () => {
		return (
			currentContext.context.trim() !== "" &&
			currentContext.prompt.trim() !== ""
		);
	};

	const renderCreationForm = () => (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				mb: 3,
				bgcolor: "background.paper",
				border: "2px solid",
				borderColor: "divider",
				borderStyle: "dashed",
			}}
		>
			<Typography variant="h4" color="secondary.dark" sx={{ mb: 2 }}>
				{editingId !== null ? "Edit Context" : "New Context"}
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
				<ESCustomTextField
					label="Context Name"
					value={currentContext.context}
					onChange={(e) => handleContextChange("context", e.target.value)}
					placeholder="Enter context name..."
					required
					width="100%"
				/>
				<ESCustomTextArea
					label="Prompt"
					value={currentContext.prompt}
					onChange={(e) => handleContextChange("prompt", e.target.value)}
					placeholder="Enter prompt for this context..."
					required
					minHeight="100px"
					isResizable="vertical"
					boxSx={{ width: "100%" }}
				/>
			</Box>
		</Paper>
	);

	const renderEmptyState = () => (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				py: 8,
				px: 3,
				bgcolor: "background.paper",
				borderRadius: 1,
				border: "2px dashed",
				borderColor: "divider",
			}}
		>
			<Inbox size={48} color="#9e9e9e" />
			<Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
				No Contexts Created
			</Typography>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mt: 1, textAlign: "center" }}
			>
				Add your first context to start configuring email summarization settings
			</Typography>
		</Box>
	);

	return (
		<Paper elevation={0} sx={{ p: 3, mb: 3 }}>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "300px 1fr",
					gap: 7,
				}}
			>
				{/* Left Side */}
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<Mail size={24} />
						<Typography
							variant="h4"
							sx={{ color: "common.black", fontWeight: "medium" }}
						>
							Email Summarise
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
						Configure email summarization settings by adding different contexts
						and their corresponding prompts. These settings will be used to
						generate concise summaries of emails based on specific contexts.
					</Typography>

					{/* Action Buttons */}
					{!isCreating ? (
						<Button
							onClick={handleStartCreate}
							variant="contained"
							startIcon={<Plus size={20} />}
							// sx={{
							// 	color: "#000",
							// 	bgcolor: "#f6f7f9",
							// 	fontWeight: "medium",
							// 	p: 1,
							// 	px: 2,
							// }}
						>
							Add New Context
						</Button>
					) : (
						<Box sx={{ display: "flex", gap: 2 }}>
							<Button
								onClick={handleSave}
								startIcon={<Save size={20} />}
								variant="contained"
								disabled={!isFormValid()}
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
							>
								{editingId !== null ? "Update Context" : "Save Context"}
							</Button>
							<Button
								onClick={handleCancel}
								startIcon={<X size={20} />}
								sx={{
									color: "text.secondary",
									borderColor: "text.secondary",
									p: 1,
									px: 2,
								}}
							>
								Cancel
							</Button>
						</Box>
					)}
				</Box>

				{/* Right Side */}
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					{contexts.length > 0 ? (
						<>
							{isCreating && renderCreationForm()}
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
									gap: 3,
								}}
							>
								{contexts.map((context) => (
									<Card
										key={context.id}
										elevation={1}
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
											bgcolor: "background.paper",
											transition: "all 0.3s ease",
											"&:hover": {
												transform: "translateY(-4px)",
												boxShadow: (theme) => theme.shadows[8],
											},
											border: "1px solid",
											borderColor: "divider",
											borderRadius: 2,
											overflow: "hidden",
										}}
									>
										<CardContent sx={{ flex: 1, p: 3, position: "relative" }}>
											{/* Header with Actions */}
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "flex-start",
													mb: 2,
												}}
											>
												<Chip
													label={context.context}
													color="primary"
													size="medium"
													sx={{
														maxWidth: "70%",
														height: "28px",
														"& .MuiChip-label": {
															px: 2,
															fontWeight: "medium",
														},
													}}
												/>
												<Box sx={{ display: "flex", gap: 1 }}>
													<IconButton
														size="small"
														onClick={() => handleEdit(context)}
														sx={{
															color: "secondary.dark",
															p: 1,
															"&:hover": {
																bgcolor: "primary.lighter",
																transform: "scale(1.1)",
															},
															transition: "all 0.2s ease",
														}}
													>
														<Edit size={16} />
													</IconButton>
													<IconButton
														size="small"
														onClick={() => handleDelete(context.id)}
														sx={{
															color: "error.main",
															p: 1,
															"&:hover": {
																bgcolor: "error.lighter",
																transform: "scale(1.1)",
															},
															transition: "all 0.2s ease",
														}}
													>
														<Trash2 size={16} />
													</IconButton>
												</Box>
											</Box>

											{/* Prompt Content with Scroll */}
											<Box
												sx={{
													mt: 2,
													maxHeight: "200px",
													overflowY: "auto",
													px: 1,
													"&::-webkit-scrollbar": {
														width: "6px",
													},
													"&::-webkit-scrollbar-thumb": {
														backgroundColor: "divider",
														borderRadius: "3px",
													},
													"&::-webkit-scrollbar-track": {
														backgroundColor: "transparent",
													},
												}}
											>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{
														lineHeight: 1.6,
														whiteSpace: "pre-wrap",
														wordBreak: "break-word",
													}}
												>
													{context.prompt}
												</Typography>
											</Box>
										</CardContent>
									</Card>
								))}
							</Box>
						</>
					) : isCreating ? (
						renderCreationForm()
					) : (
						renderEmptyState()
					)}
				</Box>
			</Box>
		</Paper>
	);
};

export default EmailSummarise;
