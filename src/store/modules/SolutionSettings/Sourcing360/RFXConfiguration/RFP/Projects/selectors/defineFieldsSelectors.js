export const selectFields = (state) =>
	state.rfxConfiguration.defineFields.fields;
export const selectSavedFields = (state) =>
	state.rfxConfiguration.defineFields.savedFields;
export const selectIsLoading = (state) =>
	state.rfxConfiguration.defineFields.isLoading;
export const selectError = (state) => state.rfxConfiguration.defineFields.error;
export const selectIsEditing = (state) =>
	state.rfxConfiguration.defineFields.isEditing;
export const selectFieldTypes = (state) =>
	state.rfxConfiguration.defineFields.fieldTypes;
export const selectFieldLabels = (state) =>
	state.rfxConfiguration.defineFields.fieldLabels;
export const selectFieldNames = (state) =>
	state.rfxConfiguration.defineFields.fieldNames;
export const selectField = (state, id) =>
	state.rfxConfiguration.defineFields.fields.find((f) => f.id === id);
