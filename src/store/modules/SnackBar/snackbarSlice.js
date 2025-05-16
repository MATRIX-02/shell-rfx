import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	open: false,
	message: "",
	severity: "info", // 'success', 'error', 'warning', 'info'
	variant: "standard", // 'standard' or 'custom'
	customContent: null,
	duration: 6000,
};

const snackbarSlice = createSlice({
	name: "snackbar",
	initialState,
	reducers: {
		showSnackbar: (state, action) => {
			state.open = true;
			state.message = action.payload.message;
			state.severity = action.payload.severity || "info";
			state.variant = action.payload.variant || "standard";
			state.customContent = action.payload.customContent || null;
			state.duration = action.payload.duration || 6000;
		},
		hideSnackbar: (state) => {
			state.open = false;
		},
	},
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
