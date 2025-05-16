export const selectSettings = (state) => state.rfxConfiguration.llmConfig.settings;
export const selectSavedSettings = (state) => state.rfxConfiguration.llmConfig.savedSettings;
export const selectIsLoading = (state) => state.rfxConfiguration.llmConfig.isLoading;
export const selectError = (state) => state.rfxConfiguration.llmConfig.error;