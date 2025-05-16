import { createSlice, isAction } from "@reduxjs/toolkit";

const initialState = {
	fields: [],
	savedFields: [
		{
			id: 1,
			fieldName: "RFP ID",
			fieldLabel: "RFP ID",
			fieldType: {
				value: "alphanumeric",
				label: "Alphanumeric",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 2,
			fieldName: "RFP Type",
			fieldLabel: "RFP Type",
			fieldType: {
				value: "Text",
				label: "Text",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 3,
			fieldName: "RFP Title",
			fieldLabel: "RFP Title",
			fieldType: {
				value: "Text",
				label: "Text",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 4,
			fieldName: "RFP Value",
			fieldLabel: "RFP Value",
			fieldType: {
				value: "Number",
				label: "Number",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 5,
			fieldName: "Category",
			fieldLabel: "Category",
			fieldType: {
				value: "Text",
				label: "Text",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 6,
			fieldName: "RFP Timeline",
			fieldLabel: "RFP Timeline",
			fieldType: {
				value: "Date",
				label: "Date",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 7,
			fieldName: "Component Requirements",
			fieldLabel: "Component Requirements",
			fieldType: {
				value: "Text",
				label: "Text",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 8,
			fieldName: "Contact Person",
			fieldLabel: "Contact Person",
			fieldType: {
				value: "Email",
				label: "Email",
			},
			isActive: true,
			isEditing: false,
		},
		{
			id: 9,
			fieldName: "Introduction",
			fieldLabel: "Introduction",
			fieldType: {
				value: "Text",
				label: "Text",
			},
			isActive: true,
			isEditing: false,
		},
	],
	idCounter: 2,
	isLoading: false,
	error: null,
	isEditing: false, // Added for global edit mode
};

const defineFieldsSlice = createSlice({
	name: "defineFields",
	initialState,
	reducers: {
		addField: (state) => {
			state.fields.push({
				id: state.idCounter,
				fieldName: "",
				fieldLabel: "",
				fieldType: null,
				isActive: true,
				isEditing: true,
			});
			state.idCounter += 1;
		},
		updateField: (state, action) => {
			const { id, field, value } = action.payload;
			// Check both fields and savedFields when in edit mode
			if (state.isEditing) {
				const savedFieldIndex = state.savedFields.findIndex((f) => f.id === id);
				if (savedFieldIndex !== -1) {
					state.savedFields[savedFieldIndex] = {
						...state.savedFields[savedFieldIndex],
						[field]: value,
					};
					return;
				}
			}

			const fieldIndex = state.fields.findIndex((f) => f.id === id);
			if (fieldIndex !== -1) {
				state.fields[fieldIndex] = {
					...state.fields[fieldIndex],
					[field]: value,
				};
			}
		},
		deleteField: (state, action) => {
			const { id, isSaved } = action.payload;
			if (isSaved) {
				state.savedFields = state.savedFields.filter((f) => f.id !== id);
			} else {
				state.fields = state.fields.filter((f) => f.id !== id);
			}
		},
		saveFields: (state) => {
			if (state.isEditing) {
				// When in edit mode, just turn off edit mode
				state.isEditing = false;
			} else {
				// Normal save operation for new fields
				const validFields = state.fields.filter(
					(f) =>
						f.fieldName.trim() !== "" &&
						f.fieldLabel.trim() !== "" &&
						f.fieldType !== null
				);

				state.savedFields = [
					...state.savedFields,
					...validFields.map((f) => ({ ...f, isEditing: false })),
				];
				state.fields = [];
			}
		},
		startEditing: (state) => {
			state.isEditing = true;
		},
		cancelEditing: (state) => {
			state.isEditing = false;
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
});

export const {
	addField,
	updateField,
	deleteField,
	saveFields,
	startEditing,
	cancelEditing,
	setLoading,
	setError,
} = defineFieldsSlice.actions;

export default defineFieldsSlice.reducer;
