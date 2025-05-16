import { createSelector } from "@reduxjs/toolkit";

// Base selector
export const selectValidationState = (state) =>
	state.rfxConfiguration.validations;

// Select all validations
export const selectAllValidations = createSelector(
	[selectValidationState],
	(state) => state.validations
);

// Select validations for a specific document type
export const selectValidationsByDocumentType = (documentTypeId) =>
	createSelector(
		[selectAllValidations],
		(validations) => validations[documentTypeId] || []
	);

// Select loading state
export const selectValidationsLoading = createSelector(
	[selectValidationState],
	(state) => state.isLoading
);

// Select error state
export const selectValidationsError = createSelector(
	[selectValidationState],
	(state) => state.error
);

// Select validation count for a document type
export const selectValidationCount = (documentTypeId) =>
	createSelector(
		[selectValidationsByDocumentType(documentTypeId)],
		(validations) => validations.length
	);

// Combined selector for validation dashboard
export const validationSelectors = createSelector(
	[selectAllValidations, selectValidationsLoading, selectValidationsError],
	(validations, isLoading, error) => ({
		validations,
		isLoading,
		error,
		totalValidations: Object.values(validations).reduce(
			(total, rules) => total + rules.length,
			0
		),
	})
);
