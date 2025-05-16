import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	numberingType: "manual",
	startingNumber: "",
	isEditing: true,
	savedSettings: null,
	status: "idle",
	error: null,
};

const numberFormatSlice = createSlice({
	name: "numberFormat",
	initialState,
	reducers: {
		setNumberingType: (state, action) => {
			state.numberingType = action.payload;
		},
		setStartingNumber: (state, action) => {
			state.startingNumber = action.payload;
		},
		saveSettings: (state) => {
			state.savedSettings = {
				numberingType: state.numberingType,
				startingNumber:
					state.numberingType === "auto" ? state.startingNumber : null,
			};
			state.isEditing = false;
		},
		startEditing: (state) => {
			state.isEditing = true;
		},
		resetNumberFormat: (state) => {
			return initialState;
		},
	},
});

export const {
	setNumberingType,
	setStartingNumber,
	saveSettings,
	startEditing,
	resetNumberFormat,
} = numberFormatSlice.actions;

export default numberFormatSlice.reducer;
