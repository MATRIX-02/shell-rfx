import React from "react";
import { Stepper, Step, StepLabel, Box, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";

// Custom Stepper component
const ESCustomStepper = ({
    steps,
    activeStep,
    onNext,
    onBack,
    loading,
    children,
    stepperSx,
    buttonSx,
    containerSx,
}) => {
    return (
        <Box sx={{ width: "100%", userSelect: "none", ...containerSx }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ ...stepperSx }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 2 }}>{children}</Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {activeStep > 0 && (
                    <LoadingButton
                        onClick={onBack}
                        variant="contained"
                        loading={false}
                        sx={{ mr: 1, ...buttonSx }}
                    >
                        Back
                    </LoadingButton>
                )}
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep < steps.length - 1 && (
                    <LoadingButton
                        onClick={onNext}
                        variant="contained"
                        loading={loading}
                        loadingIndicator={<CircularProgress size={20} sx={{ color: '#ffffff' }} />}
                        sx={{ minWidth: '100px', ...buttonSx }}
                    >
                        Next
                    </LoadingButton>
                )}
            </Box>
        </Box>
    );
};

ESCustomStepper.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeStep: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
    stepperSx: PropTypes.object,   // sx prop for Stepper
    buttonSx: PropTypes.object,    // sx prop for Buttons
    containerSx: PropTypes.object, // sx prop for main container
};

ESCustomStepper.defaultProps = {
    loading: false,
    stepperSx: {},   // Default to empty object
    buttonSx: {},    // Default to empty object
    containerSx: {}, // Default to empty object
};

export default ESCustomStepper;
