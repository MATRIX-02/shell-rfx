import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	contexts: [
		{
			id: 1729687248092,
			context: "About [Company Name]",
			prompt:
				"A brief introduction to the company, including its industry, expertise, or any unique aspects relevant to the context.",
		},
		{
			id: 1729687258277,
			context: "Requirements Summary",
			prompt:
				"Summarize the key requirements, specifications, or criteria mentioned in the document. This may include product specifications, quality standards, delivery timelines, or any unique conditions.",
		},
		{
			id: 1729687269357,
			context: "Contact Information",
			prompt:
				"Provide the contact details of the relevant person or department, including email and phone number, for further inquiries or responses.",
		},
		{
			id: 1729687328228,
			context: "Reason/Purpose",
			prompt:
				"Summarize the main objective or purpose of the email or document, such as seeking suppliers, introducing a new product, or requesting proposals for a project.",
		},
	],
	isLoading: false,
	error: null,
	isCreating: false,
	editingId: null,
	currentContext: {
		context: "",
		prompt: "",
	},
};

const emailSummariseSlice = createSlice({
	name: "emailSummarise",
	initialState,
	reducers: {
		// Creation actions
		startCreating: (state) => {
			state.isCreating = true;
			state.currentContext = { context: "", prompt: "" };
			state.editingId = null;
		},
		cancelCreating: (state) => {
			state.isCreating = false;
			state.currentContext = { context: "", prompt: "" };
			state.editingId = null;
		},
		updateCurrentContext: (state, action) => {
			state.currentContext = {
				...state.currentContext,
				...action.payload,
			};
		},

		// CRUD operations
		addContext: (state, action) => {
			state.contexts.push({
				id: Date.now(),
				...state.currentContext,
			});
			state.isCreating = false;
			state.currentContext = { context: "", prompt: "" };
		},
		updateContext: (state, action) => {
			const index = state.contexts.findIndex(
				(ctx) => ctx.id === state.editingId
			);
			if (index !== -1) {
				state.contexts[index] = {
					...state.contexts[index],
					...state.currentContext,
				};
			}
			state.isCreating = false;
			state.editingId = null;
			state.currentContext = { context: "", prompt: "" };
		},
		deleteContext: (state, action) => {
			state.contexts = state.contexts.filter(
				(ctx) => ctx.id !== action.payload
			);
		},
		startEditing: (state, action) => {
			const contextToEdit = state.contexts.find(
				(ctx) => ctx.id === action.payload
			);
			if (contextToEdit) {
				state.isCreating = true;
				state.editingId = action.payload;
				state.currentContext = {
					context: contextToEdit.context,
					prompt: contextToEdit.prompt,
				};
			}
		},

		// Async state handlers
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},

		// Bulk update (for initialization or sync)
		setContexts: (state, action) => {
			state.contexts = action.payload;
		},
	},
});

export const {
	startCreating,
	cancelCreating,
	updateCurrentContext,
	addContext,
	updateContext,
	deleteContext,
	startEditing,
	setLoading,
	setError,
	setContexts,
} = emailSummariseSlice.actions;

export default emailSummariseSlice.reducer;
