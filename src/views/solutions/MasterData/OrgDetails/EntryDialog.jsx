import React, { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import ESCustomTextField from "ui-component/ESCustomTextField";

const EntryDialog = ({
	open,
	onClose,
	title,
	data,
	setData,
	onSave,
	fields,
	isEditing,
}) => {
	const [errors, setErrors] = useState({});
	const handleChange = (key, value) => {
		if (key.includes(".")) {
			const [parent, child] = key.split(".");
			setData((prevData) => ({
				...prevData,
				[parent]: {
					...prevData[parent],
					[child]: value,
				},
			}));
		} else {
			setData((prevData) => ({ ...prevData, [key]: value }));
		}
		// Clear error when field is changed
		setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
	};

	const validateFields = () => {
		const newErrors = {};
		fields.forEach((field) => {
			if (field.type !== "checkbox") {
				let value;
				if (field.key.includes(".")) {
					const [parent, child] = field.key.split(".");
					value = data[parent]?.[child];
				} else {
					value = data[field.key];
				}
				if (!value || value.trim() === "") {
					newErrors[field.key] = "This field is required";
				}
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (validateFields()) {
			onSave();
		}
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
				{isEditing ? `Edit ${title}` : `Add New ${title}`}
			</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={2}>
					{fields.map((field) => (
						<Grid
							item
							xs={12}
							sm={6}
							key={field.key}
							sx={{ display: "flex", alignItems: "center" }}
						>
							{field.type === "checkbox" ? (
								<FormControlLabel
									control={
										<Checkbox
											checked={
												field.key.includes(".")
													? !!data[field.key.split(".")[0]]?.[
															field.key.split(".")[1]
														]
													: !!data[field.key]
											}
											onChange={(e) =>
												handleChange(field.key, e.target.checked)
											}
											name={field.key}
										/>
									}
									label={field.label}
								/>
							) : (
								<ESCustomTextField
									label={field.label}
									value={
										field.key.includes(".")
											? data[field.key.split(".")[0]]?.[
													field.key.split(".")[1]
												] || ""
											: data[field.key] || ""
									}
									onChange={(e) => handleChange(field.key, e.target.value)}
									fullWidth
									margin="normal"
									error={!!errors[field.key]}
									helperText={errors[field.key]}
									{...(field.props || {})}
								/>
							)}
						</Grid>
					))}
				</Grid>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2, bgcolor: "grey.100" }}>
				<Button onClick={onClose} variant="outlined">
					Cancel
				</Button>
				<Button onClick={handleSave} variant="contained" color="primary">
					{isEditing ? "Update" : "Create"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EntryDialog;
