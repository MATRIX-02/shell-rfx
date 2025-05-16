import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Checkbox,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import EmailIcon from "@mui/icons-material/Email";
import NumbersIcon from "@mui/icons-material/Numbers";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddIcon from "@mui/icons-material/Add";

import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomDropdown from "ui-component/ESCustomDropdown";

const fileTypes = [
	{ label: "Text", value: "text", icon: <TextFieldsIcon /> },
	{ label: "Email", value: "email", icon: <EmailIcon /> },
	{ label: "Number", value: "number", icon: <NumbersIcon /> },
	{ label: "File", value: "file", icon: <FileUploadIcon /> },
];

const AddFields = ({
	fields,
	onAddField,
	onFieldUpdate,
	onDeleteField,
	predefinedFieldsCount,
}) => {
	const [hasKeyField, setHasKeyField] = useState(false);
	const [open, setOpen] = useState(false);
	const [newField, setNewField] = useState({
		name: "",
		label: "",
		type: "",
		key: false,
		required: false,
	});
	const [errorFields, setErrorFields] = useState({
		name: false,
		label: false,
		type: false,
	});

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setErrorFields({ name: false, label: false, type: false });
		setOpen(false);
	};

	const addEsPrefix = (name) => {
		if (!name.startsWith("es_")) {
			return `es_${name}`;
		}
		return name;
	};

	const handleAddField = () => {
		let hasError = false;

		if (newField.name === "") {
			hasError = true;
			setErrorFields((prevState) => ({ ...prevState, name: true }));
		} else {
			setErrorFields((prevState) => ({ ...prevState, name: false }));
		}
		if (newField.label === "") {
			hasError = true;
			setErrorFields((prevState) => ({ ...prevState, label: true }));
		} else {
			setErrorFields((prevState) => ({ ...prevState, label: false }));
		}
		if (newField.type === "") {
			hasError = true;
			setErrorFields((prevState) => ({ ...prevState, type: true }));
		} else {
			setErrorFields((prevState) => ({ ...prevState, type: false }));
		}

		if (hasError) {
			return;
		}

		if (newField.key) {
			fields.forEach((field, index) => {
				if (field.key) {
					onFieldUpdate(index, { ...field, key: false });
				}
			});
		}

		const updatedNewField = {
			...newField,
			name: addEsPrefix(newField.name),
		};

		onAddField(updatedNewField);
		setNewField({ name: "", label: "", type: "", key: false, required: false });
		handleClose();
	};

	const handleFieldChange = (index, key, value) => {
		let updatedValue = value;
		if (key === "name") {
			updatedValue = addEsPrefix(value);
		}
		const updatedField = { ...fields[index], [key]: updatedValue };
		onFieldUpdate(index, updatedField);
	};

	const handleDeleteField = (index) => {
		onDeleteField(index);
	};

	const handleKeyChange = (index, checked) => {
		const updatedField = { ...fields[index], key: checked };
		onFieldUpdate(index, updatedField);
	};

	useEffect(() => {
		setHasKeyField(fields.some((field) => field.key));

		fields.forEach((field, index) => {
			if (!field.name.startsWith("es_")) {
				onFieldUpdate(index, { ...field, name: addEsPrefix(field.name) });
			}
		});
	}, [fields, onFieldUpdate]);

	return (
		<Box sx={{ width: "100%", padding: 4, position: "relative" }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box>
					<Typography variant="h3" sx={{ marginBottom: 2, color: "#9747ff" }}>
						Add Fields
					</Typography>
					<Typography
						variant="body1"
						sx={{ marginBottom: 4, color: "#666666" }}
					>
						You can manage the screen fields for your forms. Predefined fields
						are editable but cannot be deleted.
					</Typography>
				</Box>
				<Button
					variant="contained"
					sx={{
						backgroundColor: "#ffffff",
						"&:hover": {
							backgroundColor: "#ffffff",
							transform: "scale(1.1)",
							transition: "transform 0.2s ease",
							boxShadow: "none",
						},
						boxShadow: "none",
					}}
					onClick={handleOpen}
				>
					<Tooltip title="Add New Field" placement="top">
						<AddIcon sx={{ fontSize: "2.5rem", color: "#9747ff" }} />
					</Tooltip>
				</Button>
			</Box>

			{fields.map((field, index) => (
				<Box
					key={index}
					sx={{
						display: "flex",
						alignItems: "center",
						marginBottom: 3,
						gap: 3,
					}}
				>
					<ESCustomTextField
						label="Field Name"
						value={field.name}
						onChange={(e) => handleFieldChange(index, "name", e.target.value)}
						width={{ sm: "350px" }}
						sx={{ marginRight: 2 }}
					/>
					<ESCustomTextField
						label="Field Label"
						value={field.label}
						onChange={(e) => handleFieldChange(index, "label", e.target.value)}
						width={{ sm: "350px" }}
						sx={{ marginRight: 2 }}
					/>
					<ESCustomDropdown
						label="Field Type"
						options={fileTypes.map((type) => ({
							value: type.value,
							label: type.label,
						}))}
						width={{ sm: "350px" }}
						value={fileTypes.find((type) => type.value === field.type)}
						onChange={(selectedOption) =>
							handleFieldChange(index, "type", selectedOption.value)
						}
						sx={{ marginRight: 2 }}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={field.key}
								onChange={(e) => handleKeyChange(index, e.target.checked)}
								sx={{
									color: "#9747ff",
									"&.Mui-checked": { color: "#9747ff" },
									"&.Mui-disabled": { color: "#c4c4c4" },
								}}
								disabled={hasKeyField && !field.key}
							/>
						}
						label="Key"
						sx={{ marginRight: 2 }}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={field.required}
								onChange={(e) =>
									handleFieldChange(index, "required", e.target.checked)
								}
								sx={{ color: "#9747ff", "&.Mui-checked": { color: "#9747ff" } }}
							/>
						}
						label="Required"
					/>
					{index >= predefinedFieldsCount && (
						<Tooltip title="Delete" placement="top">
							<IconButton
								onClick={() => handleDeleteField(index)}
								sx={{
									color: "#9747ff",
									position: "absolute",
									zIndex: "3000",
									right: "0rem",
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					)}
				</Box>
			))}

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle variant="h4" component="h4">
					Add New Field
				</DialogTitle>
				<DialogContent>
					<Box
						sx={{ width: "34rem", marginBottom: "1rem", marginTop: "0.5rem" }}
					>
						<ESCustomTextField
							label="Field Name"
							value={newField.name}
							onChange={(e) =>
								setNewField({ ...newField, name: e.target.value })
							}
							width="100%"
							error={errorFields.name}
							helperText={errorFields.name ? "*Required" : ""}
						/>
					</Box>
					<Box sx={{ width: "34rem", marginBottom: "1rem" }}>
						<ESCustomTextField
							label="Field Label"
							value={newField.label}
							onChange={(e) =>
								setNewField({ ...newField, label: e.target.value })
							}
							width="100%"
							error={errorFields.label}
							helperText={errorFields.label ? "*Required" : ""}
						/>
					</Box>
					<Box sx={{ width: "34rem", marginBottom: "1rem" }}>
						<ESCustomDropdown
							label="Field Type"
							options={fileTypes.map((type) => ({
								value: type.value,
								label: type.label,
							}))}
							value={fileTypes.find((type) => type.value === newField.type)}
							onChange={(selectedOption) =>
								setNewField({ ...newField, type: selectedOption.value })
							}
							width="100%"
							error={errorFields.type}
							helperText={errorFields.type ? "*Required" : ""}
						/>
					</Box>
					<Box sx={{ padding: "0rem", margin: "0rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={newField.key}
									onChange={(e) =>
										setNewField({ ...newField, key: e.target.checked })
									}
									sx={{
										color: "#9747ff",
										"&.Mui-checked": { color: "#9747ff" },
										"&.Mui-disabled": { color: "#c4c4c4" },
									}}
									disabled={hasKeyField}
								/>
							}
							label="Key"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={newField.required}
									onChange={(e) =>
										setNewField({ ...newField, required: e.target.checked })
									}
									sx={{
										color: "#9747ff",
										"&.Mui-checked": { color: "#9747ff" },
									}}
								/>
							}
							label="Required"
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} sx={{ color: "#9747ff" }}>
						Cancel
					</Button>
					<Button
						onClick={handleAddField}
						sx={{
							backgroundColor: "#9747ff",
							color: "#fff",
							"&:hover": {
								backgroundColor: "#9747ff",
								transform: "scale(1.05)",
								transition: "transform 0.2s",
							},
						}}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default AddFields;
