import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	validations: {
		1729684764221: [
			{
				id: "1729686776968",
				contradictionName: "Technical specification mismatches",
				prompt:
					" A technical specification mismatch occurs when a component's specifications are stated differently in various sections of the RFP.  **DO NOT** make assumptions or inferences beyond the explicit information provided in the input text",
				createdAt: "2024-10-23T12:32:56.968Z",
				updatedAt: "2024-10-23T12:33:06.202Z",
			},
			{
				id: "1729686825274",
				contradictionName: "Timeline mismatches",
				prompt:
					"Timeline inconsistencies occur when a task or milestone is assigned different completion dates for same field at different stages of the project. **DO NOT** make assumptions or inferences beyond the information provided in the input text.",
				createdAt: "2024-10-23T12:33:45.274Z",
				updatedAt: "2024-10-23T12:33:48.924Z",
			},
			{
				id: "1729686832956",
				contradictionName: "Responsibility conflicts",
				prompt:
					"Compare the Responsibilities Matrix with task descriptions in the Scope of Work. Flag any conflicts.   **DO NOT** make assumptions or inferences beyond the explicit information provided in the input text.",
				createdAt: "2024-10-23T12:33:52.956Z",
				updatedAt: "2024-10-23T12:33:57.297Z",
			},
		],
		1729684758451: [
			{
				id: "1729686841172",
				contradictionName: "Technical specification mismatches",
				prompt:
					"A technical specification mismatch occurs when a component's specifications are stated differently in various sections of the RFP.  **DO NOT** make assumptions or inferences beyond the explicit information provided in the input text",
				createdAt: "2024-10-23T12:34:01.172Z",
				updatedAt: "2024-10-23T12:34:08.646Z",
			},
			{
				id: "1729686850080",
				contradictionName: "Timeline mismatches",
				prompt:
					"Timeline inconsistencies occur when a task or milestone is assigned different completion dates for same field at different stages of the project. **DO NOT** make assumptions or inferences beyond the information provided in the input text",
				createdAt: "2024-10-23T12:34:10.080Z",
				updatedAt: "2024-10-23T12:34:15.411Z",
			},
			{
				id: "1729686858136",
				contradictionName: "Responsibility conflicts",
				prompt:
					"Compare the Responsibilities Matrix with task descriptions in the Scope of Work. Flag any conflicts.   **DO NOT** make assumptions or inferences beyond the explicit information provided in the input text.",
				createdAt: "2024-10-23T12:34:18.136Z",
				updatedAt: "2024-10-23T12:34:22.201Z",
			},
		],
	},
	isLoading: false,
	error: null,
};

const validationSlice = createSlice({
	name: "validations",
	initialState,
	reducers: {
		addValidationRule: (state, action) => {
			const { documentTypeId } = action.payload;
			const newRule = {
				id: Date.now().toString(),
				contradictionName: "",
				prompt: "",
				createdAt: new Date().toISOString(),
			};

			if (!state.validations[documentTypeId]) {
				state.validations[documentTypeId] = [];
			}

			state.validations[documentTypeId].push(newRule);
		},

		updateValidationRule: (state, action) => {
			const { documentTypeId, ruleId, field, value } = action.payload;
			const rules = state.validations[documentTypeId];

			if (rules) {
				const ruleIndex = rules.findIndex((rule) => rule.id === ruleId);
				if (ruleIndex !== -1) {
					rules[ruleIndex] = {
						...rules[ruleIndex],
						[field]: value,
						updatedAt: new Date().toISOString(),
					};
				}
			}
		},

		removeValidationRule: (state, action) => {
			const { documentTypeId, ruleId } = action.payload;
			if (state.validations[documentTypeId]) {
				state.validations[documentTypeId] = state.validations[
					documentTypeId
				].filter((rule) => rule.id !== ruleId);

				// Remove empty document type entries
				if (state.validations[documentTypeId].length === 0) {
					delete state.validations[documentTypeId];
				}
			}
		},

		// When a document type is deleted, remove all its validations
		removeDocumentTypeValidations: (state, action) => {
			const { documentTypeId } = action.payload;
			delete state.validations[documentTypeId];
		},

		startSavingValidations: (state) => {
			state.isLoading = true;
			state.error = null;
		},

		saveValidationsSuccess: (state) => {
			state.isLoading = false;
			state.error = null;
		},

		saveValidationsFailed: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
	},
});

export const {
	addValidationRule,
	updateValidationRule,
	removeValidationRule,
	removeDocumentTypeValidations,
	startSavingValidations,
	saveValidationsSuccess,
	saveValidationsFailed,
} = validationSlice.actions;

// Thunk for saving validations
export const saveValidations = () => async (dispatch, getState) => {
	dispatch(startSavingValidations());
	try {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		dispatch(saveValidationsSuccess());
	} catch (error) {
		dispatch(saveValidationsFailed("Failed to save validation rules"));
	}
};

export default validationSlice.reducer;
