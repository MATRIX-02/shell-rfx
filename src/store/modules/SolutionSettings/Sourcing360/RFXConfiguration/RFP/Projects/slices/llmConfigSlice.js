import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	settings: [
		{
			id: 1,
			task: "Information Extraction",
			model: { value: "command-r-plus", label: "Command R Plus" },
			prompt:
				"You will be provided with a Request for Proposal (RFP) document, which typically includes various sections detailing a company's requirements, specifications, evaluation criteria, and submission guidelines for potential suppliers or contractors. The RFP may cover a wide range of industries and project types. Organize the extracted information into a structured format, such as a table, bullet points, or a well-defined JSON/dictionary structure. Ensure that each piece of information is labeled or categorized for easy reference.",
			temperature: "0",
			isEditing: false,
		},
		{
			id: 2,
			task: "Document Validation",
			model: { value: "llama-70b", label: "LLaMA 3.1 70B" },
			prompt: `Provide a comprehensive validation report with the following structure:

i. Summary: An overview of the proposal's compliance, highlighting any major areas of concern or excellence.

ii. Detailed Analysis: A section-by-section breakdown of the proposal's adherence to the RFP, including specific comments and suggestions for improvement.

iii. Overall Compliance Score: Assign a compliance score (e.g., on a scale of 1-100) to the proposal, indicating its overall alignment with the RFP requirements.

iv. Recommendations: Provide actionable advice for the supplier to enhance their proposal, ensuring better compliance and increasing their chances of success.`,
			temperature: "0.2",
			isEditing: false,
		},
	],
	idCounter: 3,
	isLoading: false,
	error: null,
};

const llmConfigSlice = createSlice({
	name: "llmConfig",
	initialState,
	reducers: {
		addSetting: (state) => {
			if (state.settings.length < 6) {
				state.settings.unshift({
					id: state.idCounter,
					task: "",
					model: null,
					prompt: "",
					temperature: "",
					isEditing: true,
				});
				state.idCounter += 1;
			}
		},
		updateSetting: (state, action) => {
			const { id, field, value } = action.payload;
			const settingIndex = state.settings.findIndex((s) => s.id === id);
			if (settingIndex !== -1) {
				state.settings[settingIndex] = {
					...state.settings[settingIndex],
					[field]: value,
				};
			}
		},
		deleteSetting: (state, action) => {
			const { id } = action.payload;
			state.settings = state.settings.filter((s) => s.id !== id);
		},
		saveSettings: (state) => {
			// When saving, keep the current order
			state.settings = state.settings.map((setting) => ({
				...setting,
				isEditing: false,
			}));
		},
		editSetting: (state, action) => {
			const { id } = action.payload;
			const settingIndex = state.settings.findIndex((s) => s.id === id);
			if (settingIndex !== -1) {
				state.settings[settingIndex].isEditing = true;
			}
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
	addSetting,
	updateSetting,
	deleteSetting,
	saveSettings,
	editSetting,
	setLoading,
	setError,
} = llmConfigSlice.actions;

export default llmConfigSlice.reducer;
