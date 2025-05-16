import React from "react";
import { TextField, Typography, Box, useTheme } from "@mui/material";

const ESCustomTextField = ({
	label = "",
	value = "",
	onChange = () => {},
	placeholder = "",
	required = false,
	width = "100%",
	height = "40px",
	sx = {},
	disabled = false,
	readOnly = false, // New readOnly prop
	variant = "outlined", // Variant support
	error = false,
	helperText = "",
	typographySx = {}, // New prop for Typography sx
	boxSx = {}, // New prop for Box sx
	type = "text", // New prop for type
	inputPropsSx = {}, // New prop for inputProps sx
}) => {
	const theme = useTheme();

	return (
		<Box sx={{ width, ...boxSx }}>
			{/* Label with optional required indicator */}
			<Typography
				variant="h5"
				sx={{
					color: "#696969",
					mb: 1,
					fontWeight: "400",
					...typographySx,
				}}
				gutterBottom
			>
				{label}
				{required && (
					<Box
						component="span"
						sx={{
							color: "red",
							fontSize: "1rem",
							position: "relative",
							marginLeft: "4px",
						}}
					>
						*
					</Box>
				)}
			</Typography>
			<TextField
				fullWidth
				placeholder={placeholder || "Enter value"}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled} // Disable field if readOnly is true
				variant={variant}
				error={error}
				helperText={helperText}
				type={type}
				slotProps={{
					input: {
						readOnly: readOnly,
					},
				}}
				aria-label={label}
				aria-describedby={required ? `${label}-required` : null}
				sx={{
					"& .MuiOutlinedInput-root": {
						height,
						"& fieldset": {
							borderColor: "#D2D2D2",
						},
						"&:hover fieldset": {
							borderColor: "#000",
						},
						"&.Mui-focused fieldset": {
							borderColor: readOnly
								? theme.palette.secondary[800]
								: theme.palette.primary.main,
						},
					},
					"& .MuiInputLabel-root": {
						color: "#D2D2D2",
					},
					"& .MuiInputLabel-root.Mui-focused": {
						color: "#9747ff",
					},
					...sx, // Merge with custom styles
				}}
				InputLabelProps={{
					required: required, // Automatically show asterisk if required
					shrink: true,
					style: {
						lineHeight: "11px",
						backgroundColor: "white",
					},
				}}
				inputProps={{
					readOnly: readOnly,
					style: {
						backgroundColor: "white",
						color: "#000",
						...inputPropsSx,
					},
				}}
			/>
		</Box>
	);
};

// Set default props for clarity and maintainability
ESCustomTextField.defaultProps = {
	label: "",
	value: "",
	onChange: () => {},
	placeholder: "",
	required: false,
	width: { xs: "100%" },
	height: "40px",
	sx: {},
	disabled: false,
	readOnly: false, // Default to false
	variant: "outlined",
	error: false,
	helperText: "",
	inputPropsSx: {},
};

export default ESCustomTextField;
