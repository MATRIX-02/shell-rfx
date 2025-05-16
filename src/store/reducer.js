import { combineReducers } from "redux";

// reducer import
import customizationReducer from "./customizationReducer";
import approvalReducer from "./reducer/ApprovalReducer";
import snackbarReducer from "./modules/SnackBar/snackbarSlice";
import rfxConfigurationReducer from "./modules/SolutionSettings/Sourcing360/RFXConfiguration/reducer";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
	customization: customizationReducer,
	approvalReducer: approvalReducer,
	snackbar: snackbarReducer,
	rfxConfiguration: rfxConfigurationReducer,
});

export default reducer;
