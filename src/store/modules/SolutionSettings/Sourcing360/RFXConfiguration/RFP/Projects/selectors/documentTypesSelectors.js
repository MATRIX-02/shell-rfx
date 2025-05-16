import { createSelector } from "@reduxjs/toolkit";

// Updated base selector to match your state structure
export const selectDocumentState = (state) =>
	state.rfxConfiguration.documentTypes;

// Individual selectors
export const selectDocumentTypes = createSelector(
	[selectDocumentState],
	(state) => state.documentTypes
);

export const selectSavedTypes = createSelector(
	[selectDocumentState],
	(state) => state.savedTypes
);

export const selectIsLoading = createSelector(
	[selectDocumentState],
	(state) => state.isLoading
);

export const selectError = createSelector(
	[selectDocumentState],
	(state) => state.error
);

export const selectIsEditing = createSelector(
	[selectDocumentState],
	(state) => state.isEditing
);

// Derived selectors
export const selectHasDocumentTypes = createSelector(
	[selectDocumentTypes, selectSavedTypes],
	(documentTypes, savedTypes) =>
		documentTypes.length > 0 || savedTypes.length > 0
);

export const selectHasValidTypes = createSelector(
	[selectDocumentTypes],
	(documentTypes) => documentTypes.every((type) => type.value.trim().length > 0)
);

// Combined selector for component
export const documentSelectors = createSelector(
	[
		selectDocumentTypes,
		selectSavedTypes,
		selectIsLoading,
		selectError,
		selectIsEditing,
		selectHasDocumentTypes,
		selectHasValidTypes,
	],
	(
		documentTypes,
		savedTypes,
		isLoading,
		error,
		isEditing,
		hasDocumentTypes,
		hasValidTypes
	) => ({
		documentTypes,
		savedTypes,
		isLoading,
		error,
		isEditing,
		hasDocumentTypes,
		hasValidTypes,
	})
);
