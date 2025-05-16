import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	modelKeys: {
		"gpt-35": {
			value: "skProj-wWO4XBzdFPye6iO0TpU674THbM3ghAljknf",
			isEditing: false,
		},
		"gpt-4o": {
			value: "skProj-wWO4XBzdFPye6iO0TpU674THbM3ghAljknf",
			isEditing: false,
		},
		"gpt-4-mini": {
			value: "skProj-wWO4XBzdFPye6iO0TpU674THbM3ghAljknf",
			isEditing: false,
		},
		"claude-sonnet": {
			value: "Pk-09njksdmwWO4XBzdFPye6iO0TpU674THbSKLLmcs",
			isEditing: false,
		},
		"claude-opus": {
			value: "Pk-09njksdmwWO4XBzdFPye6iO0TpU674THbSKLLmcs",
			isEditing: false,
		},
		"claude-haiku": {
			value: "Pk-09njksdmwWO4XBzdFPye6iO0TpU674THbSKLLmcs",
			isEditing: false,
		},
		"command-r-plus": {
			value: "PKnjsbymwWO4XBzdFPye6iO0TpU674THbM3ghAjhbvsdF",
			isEditing: false,
		},
		"command-r": {
			value: "PKnjsbymwWO4XBzdFPye6iO0TpU674THbM3ghAjhbvsdF",
			isEditing: false,
		},
		"llama-70b": {
			value: "LLsjk-L19xHymwWszdfzdFPye6iO0TpU674THbM3ghbafbQaa",
			isEditing: false,
		},
		"llama-8b": {
			value: "LLsjk-L19xHymwWszdfzdFPye6iO0TpU674THbM3ghbafbQaa",
			isEditing: false,
		},
		mixtral: {
			value: "LLsjk-L19xHymwWszdfzdFPye6iO0TpU674THbM3ghbafbQaa",
			isEditing: false,
		},
		"gemini-15-pro": {
			value: "psDKJNHvkshbnkaebWWwffkcsazbd",
			isEditing: false,
		},
		"gemini-10-pro": {
			value: "psDKJNHvkshbnkaebWWwffkcsazbd",
			isEditing: false,
		},
	},
	showPasswords: {},
	selectedCompany: null,
	selectedModel: null,
	status: "idle",
	error: null,
};

const modelKeysSlice = createSlice({
	name: "modelKeys",
	initialState,
	reducers: {
		updateModelKey: (state, action) => {
			const { modelId, value } = action.payload;
			if (!state.modelKeys[modelId]) {
				state.modelKeys[modelId] = { value: "", isEditing: true };
			}
			state.modelKeys[modelId].value = value;
		},
		togglePasswordVisibility: (state, action) => {
			const modelId = action.payload;
			state.showPasswords[modelId] = !state.showPasswords[modelId];
		},
		saveConfiguration: (state, action) => {
			const modelId = action.payload;
			if (state.modelKeys[modelId]) {
				state.modelKeys[modelId].isEditing = false;
			}
		},
		startEditing: (state, action) => {
			const modelId = action.payload;
			if (!state.modelKeys[modelId]) {
				state.modelKeys[modelId] = { value: "", isEditing: true };
			}
			state.modelKeys[modelId].isEditing = true;
		},
		setInitialModels: (state, action) => {
			const models = action.payload;
			// Preserve existing model keys and states
			const newShowPasswords = {};

			models.forEach((model) => {
				if (!state.modelKeys[model.id]) {
					state.modelKeys[model.id] = { value: "", isEditing: true };
				}
				newShowPasswords[model.id] = state.showPasswords[model.id] || false;
			});

			state.showPasswords = newShowPasswords;
		},
		setSelectedCompany: (state, action) => {
			state.selectedCompany = action.payload;
			state.selectedModel = null;
		},
		setSelectedModel: (state, action) => {
			state.selectedModel = action.payload;
		},
	},
});

export const {
	updateModelKey,
	togglePasswordVisibility,
	saveConfiguration,
	startEditing,
	setInitialModels,
	setSelectedCompany,
	setSelectedModel,
} = modelKeysSlice.actions;

export default modelKeysSlice.reducer;
