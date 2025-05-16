import { combineReducers } from "@reduxjs/toolkit";
import uploadFileSettingsReducer from "./RFP/Common/slices/uploadFileSettingsSlice";
import modelKeysReducer from "./RFP/Projects/slices/modelKeysSlice";
import numberFormatReducer from "./RFP/Projects/slices/numberFormatSlice";
import defineFieldsReducer from "./RFP/Projects/slices/defineFieldsSlice";
import emailSummariseReducer from "./RFP/Projects/slices/emailSummariseSlice";
import llmConfigReducer from "./RFP/Projects/slices/llmConfigSlice";
import validationReducer from "./RFP/Projects/slices/dataValidationSlice";
import documentReducer from "./RFP/Projects/slices/documentTypesSlice";

const rfxConfigurationReducer = combineReducers({
	documentTypes: documentReducer,
	validations: validationReducer,
	uploadFileSettings: uploadFileSettingsReducer,
	modelKeys: modelKeysReducer,
	numberFormat: numberFormatReducer,
	defineFields: defineFieldsReducer,
	emailSummarise: emailSummariseReducer,
	llmConfig: llmConfigReducer,
	// Add other reducers as needed
});

export default rfxConfigurationReducer;
