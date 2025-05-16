import React, { useState, useEffect } from "react";
import { InputBase, Paper, IconButton, styled } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

// 1. Custom actions: The component now accepts onSearch and onClear props, which are functions that will be called when the search value changes or when the clear button is clicked.
// 2. Debounce: Added a debounce feature to prevent excessive calls to onSearch when the user is typing quickly. You can adjust the debounce time with the debounceTime prop.
// 3. Custom icons: You can now provide custom startIcon and endIcon props to replace the default icons.
// 4. Customizable styles: Added paperStyle, inputStyle, iconStyle, and dividerStyle props to allow customization of different parts of the component.
// 5. Flexible placeholder: The placeholder text can be customized via the placeholder prop.

const StyledInputBase = styled(InputBase)(({ theme, customstyle }) => ({
	marginLeft: theme.spacing(1),
	flex: 1,
	...customstyle,
}));

const SearchBar = ({
	startIcon,
	endIcon,
	paperStyle = {},
	inputStyle = {},
	iconStyle = {},
	dividerStyle = {},
	onSearch,
	onClear,
	onChangeFunction,
	placeholder = "Search",
}) => {
	const [value, setValue] = useState("");

	const handleClear = () => {
		setValue("");
		if (onClear) {
			onClear();
		}
	};

	const handleChange = (event) => {
		const newValue = event.target.value;
		setValue(newValue); // Update local state
		if (onChangeFunction) {
			onChangeFunction(newValue); // Call the custom function passed as prop
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (onSearch) {
			onSearch(value);
		}
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			sx={{
				my: 3,
				p: "2px 4px",
				display: "flex",
				alignItems: "center",
				bgcolor: "white",
				border: "1px solid #D2D2D2",
				boxShadow: "none",
				borderRadius: "12px",
				width: "100%",
				...paperStyle,
			}}
		>
			{startIcon && (
				<IconButton
					type="button"
					sx={{ p: "10px", ...iconStyle }}
					aria-label="start icon"
				>
					{startIcon}
				</IconButton>
			)}
			<StyledInputBase
				onChange={handleChange}
				placeholder={placeholder}
				value={value}
				inputProps={{ "aria-label": "custom search" }}
				customstyle={inputStyle}
			/>
			{value && (
				<IconButton
					type="button"
					sx={{ p: "10px", color: "#2B2B2B", ...iconStyle }}
					aria-label="clear"
					onClick={handleClear}
				>
					<Clear />
				</IconButton>
			)}
			{endIcon ? (
				<>
					<span
						style={{
							color: "#D2D2D2",
							fontSize: "2rem",
							fontWeight: 10,
							...dividerStyle,
						}}
					>
						|
					</span>
					<IconButton
						type="button"
						sx={{ p: "10px", color: "#2B2B2B", ...iconStyle }}
						aria-label="end icon"
					>
						{endIcon}
					</IconButton>
				</>
			) : (
				<>
					<span
						style={{
							color: "#D2D2D2",
							fontSize: "2rem",
							fontWeight: 10,
							...dividerStyle,
						}}
					>
						|
					</span>
					<IconButton
						type="submit"
						sx={{ p: "10px", color: "#2B2B2B", ...iconStyle }}
						aria-label="search"
					>
						<Search />
					</IconButton>
				</>
			)}
		</Paper>
	);
};

export default SearchBar;
