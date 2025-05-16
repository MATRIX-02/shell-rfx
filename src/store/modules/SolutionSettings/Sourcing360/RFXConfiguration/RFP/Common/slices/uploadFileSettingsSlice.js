import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	settings: {
		supportedFormats: [
			{
				value: "pdf",
				label: "PDF",
			},
			{
				value: "doc",
				label: "DOC",
			},
			{
				value: "xlsx",
				label: "XLSX",
			},
		],
		maxSize: "10",
		errorMessage: "This format is not supported",
	},
	isEditable: false,
};

const uploadFileSettingsSlice = createSlice({
	name: "uploadFileSettings",
	initialState,
	reducers: {
		updateSettings: (state, action) => {
			state.settings = action.payload;
		},
		resetSettings: (state) => {
			state.settings = initialState.settings;
		},
		changeEditStatus: (state, action) => {
			console.log("action.payload", action.payload);
			state.isEditable = action.payload;
		},
	},
});

export const { updateSettings, resetSettings, changeEditStatus } =
	uploadFileSettingsSlice.actions;
export default uploadFileSettingsSlice.reducer;
