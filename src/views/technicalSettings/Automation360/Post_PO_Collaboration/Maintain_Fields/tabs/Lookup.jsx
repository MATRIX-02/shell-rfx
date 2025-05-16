import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
const Lookup = ({ fields }) => {
	// Sample endpoints for the dropdown
	const endpoints = [
		{ value: "Endpoint A", label: "Endpoint A" },
		{ value: "Endpoint B", label: "Endpoint B" },
		{ value: "Endpoint C", label: "Endpoint C" },
		{ value: "Endpoint D", label: "Endpoint D" },
	];

	return (
		<Box sx={{ width: "100%", padding: 4 }}>
			<Box sx={{ marginBottom: 4 }}>
				<Typography variant="h3" sx={{ marginBottom: 2, color: "#9747ff" }}>
					Lookup Fields
				</Typography>
				<Typography variant="body1" sx={{ color: "#666666" }}>
					Review and configure endpoints for your lookup fields.
				</Typography>
			</Box>
			<Paper elevation={3} sx={{ p: 2 }}>
				{/* Table Header */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						p: 2,
						borderBottom: "2px solid #9747ff",
					}}
				>
					<Typography
						variant="subtitle1"
						sx={{ width: "30%", fontWeight: "bold", color: "#9747ff" }}
					>
						Field Label
					</Typography>
					<Typography
						variant="subtitle1"
						sx={{
							width: "30%",
							fontWeight: "bold",
							color: "#9747ff",
							marginLeft: "110px",
						}}
					>
						Field Name
					</Typography>
					<Typography
						variant="subtitle1"
						sx={{
							width: "40%",
							fontWeight: "bold",
							color: "#9747ff",
							marginLeft: "250px",
						}}
					>
						Endpoints
					</Typography>
				</Box>

				{/* Table Body */}
				{fields.map((field, index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							alignItems: "center",
							p: 2,
							borderBottom:
								index < fields.length - 1 ? "1px solid #e0e0e0" : "none",
							"&:hover": {
								backgroundColor: "#f9f4ff",
								transition: "background-color 0.3s",
							},
						}}
					>
						<Typography variant="body1" sx={{ width: "30%", color: "#000000" }}>
							{field.label}
						</Typography>
						<Typography variant="body1" sx={{ width: "30%", color: "#000000" }}>
							{field.name}
						</Typography>
						<Box sx={{ width: "40%" }}>
							<ESCustomDropdown
								options={endpoints}
								value={endpoints.find(
									(endpoint) => endpoint.value === field.endpoint
								)}
								onChange={(selectedOption) => {
									// Handle endpoint change
									console.log(
										`Endpoint changed for ${field.name}:`,
										selectedOption ? selectedOption.value : null
									);
								}}
								placeholder="Select an endpoint..."
								isClearable={true}
								width="350px"
								height="40px"
								additionalStyles={{
									control: {
										borderColor: "#d0d0d0",
										"&:hover": {
											borderColor: "#5e17eb",
										},
									},
									option: {
										backgroundColor: (state) =>
											state.isFocused || state.isSelected ? "#E8DEF8" : "white",
										color: (state) =>
											state.isFocused || state.isSelected ? "#000" : "#333",
										"&:active": {
											backgroundColor: "#9747FF",
											color: "#fff",
										},
									},
								}}
							/>
						</Box>
					</Box>
				))}
			</Paper>
		</Box>
	);
};

export default Lookup;
