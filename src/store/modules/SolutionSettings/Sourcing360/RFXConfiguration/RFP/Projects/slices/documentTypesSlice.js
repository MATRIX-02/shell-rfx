import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	documentTypes: [], // Array of document types being edited
	savedTypes: [
		{
			id: "1729684764221",
			value: "IT Service Tender",
			isEditing: false,
		},
		{
			id: "1729684758451",
			value: "EPC Tender",
			isEditing: false,
		},
	], // Array of saved document types
	backupTypes: [
		{
			id: "1729684764221",
			value: "IT Service Tender",
			isEditing: false,
		},
		{
			id: "1729684758451",
			value: "EPC Tender",
			isEditing: false,
		},
	], // Backup of saved types for canceling edits
	isLoading: false,
	error: null,
	isEditing: false,
};

const documentSlice = createSlice({
	name: "document",
	initialState,
	reducers: {
		addDocumentType: (state, action) => {
			const newType = {
				id: Date.now().toString(),
				value: "",
				isEditing: true,
			};
			state.documentTypes = [newType, ...state.documentTypes];
			state.isEditing = true; // Add this line
		},
		updateDocumentType: (state, action) => {
			const { id, value } = action.payload;
			state.documentTypes = state.documentTypes.map((type) =>
				type.id === id ? { ...type, value } : type
			);
		},
		deleteDocumentType: (state, action) => {
			const { id, isSaved } = action.payload;
			if (isSaved) {
				state.savedTypes = state.savedTypes.filter((type) => type.id !== id);
			} else {
				state.documentTypes = state.documentTypes.filter(
					(type) => type.id !== id
				);
			}
		},
		startSaving: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		savingSuccess: (state) => {
			const newSavedTypes = [
				...state.documentTypes.map((type) => ({
					...type,
					isEditing: false,
				})),
				...state.savedTypes,
			];
			state.savedTypes = newSavedTypes;
			state.documentTypes = [];
			state.backupTypes = newSavedTypes;
			state.isLoading = false;
			state.error = null;
			state.isEditing = false;
		},
		savingFailed: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		startEditing: (state) => {
			state.backupTypes = state.savedTypes;
			state.documentTypes = state.savedTypes.map((type) => ({
				...type,
				isEditing: true,
			}));
			state.savedTypes = [];
			state.isEditing = true;
		},
		cancelEditing: (state) => {
			state.documentTypes = [];
			state.savedTypes = state.backupTypes;
			state.error = null;
			state.isEditing = false;
		},
	},
});

export const {
	addDocumentType,
	updateDocumentType,
	deleteDocumentType,
	startSaving,
	savingSuccess,
	savingFailed,
	startEditing,
	cancelEditing,
} = documentSlice.actions;

// Thunk for handling async save operation
export const saveDocumentTypes = () => async (dispatch, getState) => {
	dispatch(startSaving());
	try {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		dispatch(savingSuccess());
	} catch (error) {
		dispatch(savingFailed("Failed to save document types"));
	}
};

export default documentSlice.reducer;
