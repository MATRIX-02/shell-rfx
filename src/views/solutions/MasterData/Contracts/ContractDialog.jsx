import React, { useState, useEffect } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
} from "@mui/material";
import ESCustomTextField from "ui-component/ESCustomTextField";

const ContractDialog = ({ open, onClose, onSave, contract, isEditing }) => {
	const [formData, setFormData] = useState({});
	const [file, setFile] = useState(null);

	useEffect(() => {
		if (contract) {
			setFormData(contract);
		} else {
			setFormData({});
		}
		setFile(null);
	}, [contract]);

	const handleChange = (key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleFileChange = (event) => {
		const uploadedFile = event.target.files[0];
		setFile(uploadedFile);
		console.log(file);
		handleChange("file", !!uploadedFile);
	};

	const handleSave = () => {
		const numericFields = [
			"avg_cost_per_hour",
			"fixed_cost",
			"contract_value",
			"contract_utilised",
			"contract_term",
			"base_rate_per_mile",
		];

		const processedData = { ...formData };
		numericFields.forEach((field) => {
			if (processedData[field]) {
				processedData[field] = Number(processedData[field]);
			}
		});

		processedData.file = !!file;

		onSave(processedData, file);
	};

	const fields = [
		{ key: "category", label: "Category" },
		{ key: "parent_category", label: "Parent Category" },
		{ key: "supplier_name", label: "Supplier Name" },
		{ key: "supplier_id", label: "Supplier ID" },
		{ key: "contract_id", label: "Contract ID" },
		{
			key: "contract_value",
			label: "Contract Value",
			props: { type: "number" },
		},
		{
			key: "fixed_cost",
			label: "Fixed Cost",
			props: { type: "number" },
		},
		{
			key: "contract_utilised",
			label: "Contract Utilised",
			props: { type: "number" },
		},
		{
			key: "contract_term",
			label: "Contract Term",
			props: { type: "number" },
		},
		{ key: "form_id", label: "Form ID" },
		{ key: "form_description", label: "Form Description" },
		{ key: "description", label: "Description" },
		{ key: "currency", label: "Currency" },
		{
			key: "contract_start_date",
			label: "Start Date",
			props: { type: "date" },
		},
		{
			key: "contract_end_date",
			label: "End Date",
			props: { type: "date" },
		},
		{
			key: "avg_cost_per_hour",
			label: "Avg Cost Per Hour",
			props: { type: "number" },
		},
		{
			key: "hours_worked",
			label: "Hours Worked",
			props: { type: "number" },
		},
		{
			key: "base_rate_per_mile",
			label: "Base Rate Per Mile",
			props: { type: "number" },
		},
		{ key: "unit_of_measure", label: "Unit of Measure" },
		{ key: "service_name", label: "Service Name" },
	];

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle
				sx={{
					bgcolor: "secondary.dark",
					color: "primary.contrastText",
					fontSize: 20,
				}}
			>
				{isEditing ? "Edit Contract" : "Add New Contract"}
			</DialogTitle>
			<DialogContent dividers>
				<Grid container spacing={2}>
					{fields.map((field) => (
						<Grid item xs={12} sm={6} key={field.key}>
							<ESCustomTextField
								label={field.label}
								value={formData[field.key] || ""}
								onChange={(e) => handleChange(field.key, e.target.value)}
								fullWidth
								margin="normal"
								{...(field.props || {})}
							/>
						</Grid>
					))}
					<Grid item xs={12}>
						<input
							accept="application/pdf"
							style={{ display: "none" }}
							id="raised-button-file"
							type="file"
							onChange={handleFileChange}
						/>
						<label htmlFor="raised-button-file">
							<Button variant="outlined" component="span">
								Upload Contract File
							</Button>
						</label>
						{file && <span style={{ marginLeft: 10 }}>{file.name}</span>}
					</Grid>
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

export default ContractDialog;
