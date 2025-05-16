import React from "react";
import {
	Box,
	Typography,
	Paper,
	IconButton,
	Button,
	Stack,
	Collapse,
	Chip,
	Tooltip,
	Card,
	CardContent,
	alpha,
	Divider,
} from "@mui/material";
import {
	Plus,
	Trash2,
	Save,
	Brain,
	Edit2,
	Settings2,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomTextArea from "ui-component/ESCustomTextArea";
import { useDispatch, useSelector } from "react-redux";
import {
	addSetting,
	updateSetting,
	deleteSetting,
	saveSettings,
	editSetting,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/llmConfigSlice";
import {
	selectSettings,
	selectIsLoading,
	selectError,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/selectors/llmConfigSelectors";

const MODEL_OPTIONS = [
	{ value: "gpt-4", label: "GPT-4" },
	{ value: "gpt-3.5", label: "GPT-3.5" },
	{ value: "claude-2", label: "Claude 2" },
	{ value: "claude-instant", label: "Claude Instant" },
	{ value: "command-r-plus", label: "Command R Plus" },
	{ value: "llama-70b", label: "LLaMA 3.1 70B" },
];

const EmptyLLMState = () => {
	return (
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
				<Settings2 size={48} color="#9e9e9e" />
			</Box>

			<Typography
				variant="h6"
				sx={{
					color: "text.primary",
					mb: 1,
					fontWeight: 500,
				}}
			>
				No LLM Settings Configured
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
				Configure your LLM settings by adding tasks with specific models,
				prompts, and parameters to automate your workflow.
			</Typography>
			<Stack
				direction="row"
				spacing={3}
				sx={{
					color: "text.disabled",
				}}
			>
				{["Task", "Model", "Temperature", "Prompt"].map((label) => (
					<Stack key={label} direction="row" spacing={1} alignItems="center">
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: "50%",
								bgcolor: "grey.400",
							}}
						/>
						<Typography variant="caption">{label}</Typography>
					</Stack>
				))}
			</Stack>
		</Box>
	);
};

function LLMConfig() {
	const dispatch = useDispatch();
	const settings = useSelector(selectSettings);
	const isLoading = useSelector(selectIsLoading);
	const error = useSelector(selectError);
	const [expandedSettings, setExpandedSettings] = React.useState({});

	const handleAddSetting = () => {
		dispatch(addSetting());
	};

	const handleDelete = (id) => {
		dispatch(deleteSetting({ id }));
		// Clean up the expanded state when deleting a setting
		setExpandedSettings((prev) => {
			const newState = { ...prev };
			delete newState[id];
			return newState;
		});
	};

	const handleEdit = (id) => {
		dispatch(editSetting({ id }));
	};

	const handleChange = (id, field, value) => {
		dispatch(updateSetting({ id, field, value }));
	};

	const handleSave = () => {
		dispatch(saveSettings());
	};

	const toggleExpanded = (id) => {
		setExpandedSettings((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const renderSettingRow = (setting) => {
		const isExpanded = expandedSettings[setting.id] !== false;
		return (
			<Card
				elevation={1}
				sx={{
					position: "relative",
					transition: "all 0.2s ease-in-out",
					"&:hover": {
						boxShadow: (theme) => theme.shadows[3],
					},
					border: (theme) => `1px solid ${theme.palette.grey[200]}`,
				}}
			>
				<CardContent sx={{ pb: 2 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Typography variant="subtitle1" fontWeight="medium">
								{setting.task || "New Setting"}
							</Typography>
							{setting.model && (
								<Chip
									label={setting.model.label}
									size="small"
									sx={{
										bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
										color: "primary.main",
										fontWeight: 500,
									}}
								/>
							)}
						</Box>
						<Box sx={{ display: "flex", gap: 1 }}>
							{!setting.isEditing ? (
								<Tooltip title="Edit Setting">
									<IconButton
										size="small"
										onClick={() => handleEdit(setting.id)}
										sx={{
											color: "primary.main",
											"&:hover": {
												bgcolor: (theme) =>
													alpha(theme.palette.primary.main, 0.1),
											},
										}}
									>
										<Edit2 size={18} />
									</IconButton>
								</Tooltip>
							) : null}
							<Tooltip title="Delete Setting">
								<IconButton
									size="small"
									onClick={() => handleDelete(setting.id)}
									sx={{
										color: "error.main",
										"&:hover": {
											bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
										},
									}}
								>
									<Trash2 size={18} />
								</IconButton>
							</Tooltip>
							<Tooltip title={isExpanded ? "Collapse" : "Expand"}>
								<IconButton
									size="small"
									onClick={() => toggleExpanded(setting.id)}
									sx={{
										color: "grey.600",
										"&:hover": {
											bgcolor: "grey.100",
										},
									}}
								>
									{isExpanded ? (
										<ChevronUp size={18} />
									) : (
										<ChevronDown size={18} />
									)}
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
					{isExpanded && <Divider sx={{ my: 2 }} />}
					<Collapse in={isExpanded}>
						<Stack spacing={3}>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 0.8fr",
									gap: 3,
									alignItems: "start",
								}}
							>
								<ESCustomTextField
									label="Task"
									placeholder="Enter task description"
									value={setting.task}
									onChange={(e) =>
										handleChange(setting.id, "task", e.target.value)
									}
									fullWidth
									required
									error={!setting.task}
									helperText={!setting.task ? "Task is required" : ""}
									disabled={!setting.isEditing}
									size="small"
								/>

								<ESCustomDropdown
									label="Model"
									options={MODEL_OPTIONS}
									value={setting.model}
									onChange={(selectedOption) =>
										handleChange(setting.id, "model", selectedOption)
									}
									isClearable
									required
									error={!setting.model}
									helperText={!setting.model ? "Model is required" : ""}
									isDisabled={!setting.isEditing}
									size="small"
								/>

								<ESCustomTextField
									label="Temperature"
									placeholder="0.0 - 1.0"
									value={setting.temperature}
									onChange={(e) =>
										handleChange(setting.id, "temperature", e.target.value)
									}
									error={
										!Number.isFinite(parseFloat(setting.temperature)) ||
										parseFloat(setting.temperature) < 0 ||
										parseFloat(setting.temperature) > 1
									}
									helperText={
										!Number.isFinite(parseFloat(setting.temperature)) ||
										parseFloat(setting.temperature) < 0 ||
										parseFloat(setting.temperature) > 1
											? "Temperature must be between 0 and 1"
											: ""
									}
									disabled={!setting.isEditing}
									size="small"
								/>
							</Box>

							<ESCustomTextArea
								label="Prompt"
								placeholder="Enter detailed prompt"
								value={setting.prompt}
								onChange={(e) =>
									handleChange(setting.id, "prompt", e.target.value)
								}
								fullWidth
								minRows={3}
								required
								error={!setting.prompt}
								helperText={!setting.prompt ? "Prompt is required" : ""}
								disabled={!setting.isEditing}
								size="small"
							/>
						</Stack>
					</Collapse>
				</CardContent>
			</Card>
		);
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
						<Brain size={24} />
						<Typography
							variant="h4"
							sx={{ color: "common.black", fontWeight: "medium" }}
						>
							LLM Configuration
						</Typography>
					</Box>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
						Configure up to 6 different prompt settings with specific tasks,
						models, and parameters.
					</Typography>

					{settings.length < 6 && (
						<Button
							onClick={handleAddSetting}
							size="medium"
							startIcon={<Plus size={20} />}
							variant="contained"
						>
							Add Setting
						</Button>
					)}
				</Box>

				<Box>
					<Stack spacing={2}>
						{settings.map((setting) => renderSettingRow(setting))}
					</Stack>

					{settings.some((setting) => setting.isEditing) && (
						<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
							<Button
								variant="contained"
								startIcon={<Save size={20} />}
								onClick={handleSave}
								disabled={settings.some(
									(s) =>
										!s.model ||
										!s.task ||
										s.prompt.trim() === "" ||
										!Number.isFinite(parseFloat(s.temperature)) ||
										parseFloat(s.temperature) < 0 ||
										parseFloat(s.temperature) > 1
								)}
								sx={{
									bgcolor: "grey.900",
									"&:hover": {
										bgcolor: "grey.800",
									},
									px: 2,
									py: 1,
								}}
							>
								Save Configuration
							</Button>
						</Box>
					)}
				</Box>
			</Box>
		</Paper>
	);
}

export default LLMConfig;
