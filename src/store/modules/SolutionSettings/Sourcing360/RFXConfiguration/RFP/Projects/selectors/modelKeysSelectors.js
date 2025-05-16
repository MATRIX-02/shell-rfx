export const selectModelKeys = (state) => state.rfxConfiguration.modelKeys.modelKeys;
export const selectShowPasswords = (state) => state.rfxConfiguration.modelKeys.showPasswords;
export const selectSelectedCompany = (state) => state.rfxConfiguration.modelKeys.selectedCompany;
export const selectSelectedModel = (state) => state.rfxConfiguration.modelKeys.selectedModel;

// Helper selector to get specific model key data
export const selectModelKeyData = (state, modelId) => state.rfxConfiguration.modelKeys.modelKeys[modelId];

// Helper selector to check if a model is in edit mode
export const selectIsModelEditing = (state, modelId) => 
  state.rfxConfiguration.modelKeys.modelKeys[modelId]?.isEditing ?? true;

// Helper selector to get model key value
export const selectModelKeyValue = (state, modelId) =>
  state.rfxConfiguration.modelKeys.modelKeys[modelId]?.value ?? '';